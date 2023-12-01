import 'dotenv/config'
import { Dropbox } from 'dropbox'

const { DROPBOX_ACCESS_KEY } = process.env

export const dbx = new Dropbox({ accessToken: DROPBOX_ACCESS_KEY })