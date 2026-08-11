import prisma   from '../../config/prisma.js'
import supabase from '../../config/supabase.js'

// ── Upload file to Supabase Storage ───────────────────────────────────────
const uploadToStorage = async (clientId, type, file) => {
  const path = `clients/${clientId}/${type}.pdf`

  const { error } = await supabase.storage
    .from('documents')
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert:      true,
    })

  if (error) throw new Error('UPLOAD_FAILED')

  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(path)

  return data.publicUrl
}

// ── Upload document ────────────────────────────────────────────────────────
export const uploadDocument = async (clientId, type, file) => {
  const fileUrl = await uploadToStorage(clientId, type, file)

  const existing = await prisma.clientDocument.findFirst({
    where: { clientId, type }
  })

  if (existing) {
    return await prisma.clientDocument.update({
      where: { id: existing.id },
      data: {
        fileUrl,
        status:     'PENDING',
        uploadedAt: new Date(),
        adminNotes: null,
      }
    })
  }

  return await prisma.clientDocument.create({
    data: { clientId, type, fileUrl, status: 'PENDING' }
  })
}

// ── Get all client documents ───────────────────────────────────────────────
export const getDocuments = async (clientId) => {
  return await prisma.clientDocument.findMany({
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
}