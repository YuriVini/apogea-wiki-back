// import { prisma } from "../../../lib/prisma";

// interface FileInput {
//   data: string;
//   filename: string;
// }

// export const saveFile = async ({ data, filename }: FileInput): Promise<string> => {
//   const base64Data = data.includes(",") ? data.split(",")[1] : data;

//   const fileType = getMimeType(filename);

//   try {
//     const file = await prisma.files.create({
//       data: {
//         filename,
//         fileType,
//         data: base64Data,
//       },
//     });
//     console.log(`Arquivo ${filename} salvo com ID: ${file.id}`);
//     return file.id;
//   } catch (error) {
//     console.error(`Erro ao salvar o arquivo ${filename}:`, error);
//     throw new Error(`Failed to save file: ${filename}`);
//   }
// };

// const getMimeType = (filename: string): string => {
//   const extension = filename.split(".").pop()?.toLowerCase();

//   switch (extension) {
//     case "jpeg":
//     case "jpg":
//       return "image/jpeg";
//     case "pdf":
//       return "application/pdf";
//     case "png":
//       return "image/png";
//     default:
//       return "application/octet-stream";
//   }
// };
