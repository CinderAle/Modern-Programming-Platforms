import { IMAGES } from '@/constants/images';
import { FileSavingError } from '@/error/fileSaving';
import { unlinkSync } from 'fs';
import path from 'path';
import * as uuid from 'uuid';
import fs from 'fs';

class FileService {
    create(file: ArrayBuffer) {
        try {
            const fileName = `${uuid.v4()}.jpg`;
            const filePath = path.resolve('@/../static/images', fileName);
            fs.writeFileSync(filePath, Buffer.from(new Uint8Array(file)));
            return `http://localhost:8080/images/${fileName}`;
        } catch (e: any) {
            throw new FileSavingError(e.message);
        }
    }

    delete(filePath: string) {
        const fileName = path.basename(filePath);
        if (fileName !== IMAGES.NONE) unlinkSync(`@/../static/images/${fileName}`);
    }
}

export default new FileService();
