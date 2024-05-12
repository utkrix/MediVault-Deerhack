import CryptoJS from 'crypto-js';

function hashValue(value) {
  const hashedValue = CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
  return hashedValue;
}


export default hashValue