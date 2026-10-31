import prisma from '../../../config/prisma.js'
import { uploadFile, withSignedUrl, withSignedUrls } from '../../../utils/storage.js'

// ── Upload file to Supabase Storage ───────────────────────────────────────
// Returns the file's path in the bucket (e.g. clients/5/NATIONAL_ID.pdf).
// We used to return a public URL here, but that meant anyone with the link
// could open a client's ID card forever. Now we only keep the path and hand
// out short-lived signed links when someone actually asks for the file.
const uploadToStorage = async (clientId, type, file) => {
  const path = `clients/${clientId}/${type}.pdf`

  console.log('\x1b[36m\n-> Service Uploading file to Supabase Storage\x1b[0m')
  console.log('Uploading file to Supabase Storage at path:', path, '\nwith mimetype:', file.mimetype, '\nand size:', file.size)

  return await uploadFile(path, file)
}

// ── Upload document ────────────────────────────────────────────────────────
export const uploadDocument = async (clientId, type, file) => {
  // heads up: despite the name, fileUrl now stores the storage path, not a link.
  // Kept the column name so we don't need a migration just for this.
  const fileUrl = await uploadToStorage(clientId, type, file)

  console.log('\nFile uploaded to Supabase Storage, path:', fileUrl)

  const existing = await prisma.clientDocument.findFirst({
    where: { clientId, type }
  })

  let doc

  if (existing) {
    doc = await prisma.clientDocument.update({
      where: { id: existing.id },
      data: {
        fileUrl,
        status:     'PENDING',
        uploadedAt: new Date(),
        adminNotes: null,
      }
    })
  } else {
    doc = await prisma.clientDocument.create({
      data: { clientId, type, fileUrl, status: 'PENDING' }
    })
  }

  // give the client a working (temporary) link back instead of the raw path
  return await withSignedUrl(doc)
}

// ── Get all client documents ───────────────────────────────────────────────
export const getDocuments = async (clientId) => {
  const docs = await prisma.clientDocument.findMany({
    where:   { clientId },
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
