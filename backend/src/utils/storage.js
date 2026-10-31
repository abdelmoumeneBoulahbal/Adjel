import supabase from '../config/supabase.js'

// All client and merchant documents live in this bucket.
// It should be PRIVATE in the Supabase dashboard; these files are ID cards,
// salary slips and tax papers, so nobody should be able to open them
// just by knowing (or guessing) the address.
const BUCKET = 'documents'

// How long a signed link keeps working, in seconds.
// 10 minutes is plenty for someone to click and view a PDF. If links keep
// expiring on you while testing in Postman, raise SIGNED_URL_EXPIRES_IN in .env.
const getExpiry = () => Number(process.env.SIGNED_URL_EXPIRES_IN) || 600

// Older rows in the database store a full public URL instead of just the path,
// e.g. https://xxx.supabase.co/storage/v1/object/public/documents/clients/5/NATIONAL_ID.pdf
// Rather than migrating that data, we just pull the path back out of it here.
const toPath = (stored) => {
  const marker = `/object/public/${BUCKET}/`
  const index  = stored.indexOf(marker)

  if (stored.startsWith('http') && index !== -1) {
    return decodeURIComponent(stored.slice(index + marker.length))
  }

  return stored
}

// ── Upload a file and return its path inside the bucket ──────────────────
// We save the path, never a link. Links are created on demand (see below)
// so they can expire.
export const uploadFile = async (path, file) => {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert:      true,
    })

  if (error) {
    console.error('\x1b[31mSUPABASE STORAGE ERROR:\x1b[0m', error)
    throw new Error('UPLOAD_FAILED')
  }

  return path
}

// ── Swap the stored path on each document for a short-lived signed link ──
// Takes a list of documents (anything with a fileUrl) and returns the same
// list, but with fileUrl replaced by a link that works for a few minutes.
// One request to Supabase no matter how many documents there are.
//
// If a file can't be signed (deleted from storage, typo in the path...),
// that document gets fileUrl: null instead of breaking the whole response.
export const withSignedUrls = async (docs) => {
  if (!docs.length) return docs

  const paths = docs.map(doc => toPath(doc.fileUrl))

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, getExpiry())

  if (error) {
    console.error('\x1b[31mSUPABASE SIGNED URL ERROR:\x1b[0m', error)
    return docs.map(doc => ({ ...doc, fileUrl: null }))
  }

  return docs.map((doc, i) => ({
    ...doc,
    fileUrl: data[i]?.signedUrl ?? null,
  }))
}

// Same thing for a single document, handy right after an upload.
export const withSignedUrl = async (doc) => {
  const [signed] = await withSignedUrls([doc])
  return signed
}
