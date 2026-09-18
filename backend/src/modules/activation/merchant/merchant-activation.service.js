import prisma   from '../../../config/prisma.js'
import supabase from '../../../config/supabase.js'

// ── Upload file to Supabase Storage ───────────────────────────────────────
const uploadToStorage = async (merchantId, type, file) => {
  const path = `merchants/${merchantId}/${type}.pdf`

  console.log('\x1b[36m\n-> Service Uploading file to Supabase Storage\x1b[0m')
  console.log('Uploading file to Supabase Storage at path:', path, '\nwith mimetype:', file.mimetype, '\nand size:', file.size)


  const { error } = await supabase.storage
    .from('documents')
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert:      true,
    })

  if (error) {
    console.error('\x1b[31mSUPABASE STORAGE ERROR:\x1b[0m', error)
    throw new Error('UPLOAD_FAILED')
  }

  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(path)

  return data.publicUrl
}

// ── Upload document ────────────────────────────────────────────────────────
export const uploadDocument = async (merchantId, type, file) => {
  const fileUrl = await uploadToStorage(merchantId, type, file)

  console.log('\nFile uploaded to Supabase Storage, public URL:', fileUrl)

  const existing = await prisma.merchantDocument.findFirst({
    where: { merchantId, type }
  })

  if (existing) {
    return await prisma.merchantDocument.update({
      where: { id: existing.id },
      data: {
        fileUrl,
        status:     'PENDING',
        uploadedAt: new Date(),
        adminNotes: null,
      }
    })
  }

  return await prisma.merchantDocument.create({
    data: { merchantId, type, fileUrl, status: 'PENDING' }
  })
}

// ── Get all merchant documents ───────────────────────────────────────────────
export const getDocuments = async (merchantId) => {
  return await prisma.merchantDocument.findMany({
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
}