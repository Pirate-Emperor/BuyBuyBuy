import crypto from "crypto"

const salt = "P3VacNiTcH"

function hash(plainText: string) {
    if (!plainText) return null;

    return crypto.createHmac("sha512", salt).update(plainText).digest("hex");
}

export default hash