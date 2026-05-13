import * as ftp from "basic-ftp";

export async function uploadViaFTP(buffer: Buffer, remotePath: string): Promise<void> {
  const client = new ftp.Client();
  try {
    await client.access({
      host: process.env.FTP_HOST!,
      user: process.env.FTP_USER!,
      password: process.env.FTP_PASSWORD!,
      port: Number(process.env.FTP_PORT) || 21,
      secure: false,
    });
    const { Readable } = await import("stream");
    const stream = Readable.from(buffer);
    await client.uploadFrom(stream, remotePath);
  } finally {
    client.close();
  }
}

export async function deleteViaFTP(remotePath: string): Promise<void> {
  const client = new ftp.Client();
  try {
    await client.access({
      host: process.env.FTP_HOST!,
      user: process.env.FTP_USER!,
      password: process.env.FTP_PASSWORD!,
      port: Number(process.env.FTP_PORT) || 21,
      secure: false,
    });
    await client.remove(remotePath);
  } catch {
    // file might not exist, ignore
  } finally {
    client.close();
  }
}
