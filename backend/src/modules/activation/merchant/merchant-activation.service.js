import prisma from '../../../config/prisma.js'
import { uploadFile, withSignedUrl, withSignedUrls } from '../../../utils/storage.js'

// ── Upload file to Supabase Storage ───────────────────────────────────────
// Returns the file's path in the bucket (e.g. merchants/5/TAX_CERTIFICATE.pdf).
// Same story as on the client side: no more public URLs, business papers
// shouldn't be readable by anyone who stumbles on a link.
const uploadToStorage = async (merchantId, type, file) => {
  const path = `merchants/${merchantId}/${type}.pdf`

  console.log('\x1b[36m\n-> Service Uploading file to Supabase Storage\x1b[0m')
  console.log('Uploading file to Supabase Storage at path:', path, '\nwith mimetype:', file.mimetype, '\nand size:', file.size)

  return await uploadFile(path, file)
}

// ── Upload document ────────────────────────────────────────────────────────
export const uploadDocument = async (merchantId, type, file) => {
  // heads up: despite the name, fileUrl now stores the storage path, not a link.
  // Kept the column name so we don't need a migration just for this.
  const fileUrl = await uploadToStorage(merchantId, type, file)

  console.log('\nFile uploaded to Supabase Storage, path:', fileUrl)

  const existing = await prisma.merchantDocument.findFirst({
    where: { merchantId, type }
  })

  let doc

  if (existing) {
    doc = await prisma.merchantDocument.update({
      where: { id: existing.id },
      data: {
        fileUrl,
        status:     'PENDING',
        uploadedAt: new Date(),
        adminNotes: null,
      }
    })
  } else {
    doc = await prisma.merchantDocument.create({
      data: { merchantId, type, fileUrl, status: 'PENDING' }
    })
  }

  // give the merchant a working (temporary) link back instead of the raw path
  return await withSignedUrl(doc)
}

// ── Get all merchant documents ───────────────────────────────────────────────
export const getDocuments = async (merchantId) => {
  const docs = await prisma.merchantDocument.findMany({
    where:   { merchantId },
    select: {
      id:         true,
      type:       true,
      status:     true,
      fileUrl:    true,
      uploadedAt: true,
      adminNotes: true,
    },
    orderBy: { uploadedAt: 'asc' }
  })

  // links are generated fresh on every request, so if one expired
  // just call this endpoint again to get a new one
  return await withSignedUrls(docs)
}
