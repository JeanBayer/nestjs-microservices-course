export class Venn {
  static getExclusive(arrA: number[], arrB: number[], conjunto = 'A') {
    if (conjunto === 'A') {
      return [...new Set(arrA.filter((item) => !arrB.includes(item)))];
    } else if (conjunto === 'B') {
      return [...new Set(arrB.filter((item) => !arrA.includes(item)))];
    } else {
      throw new Error("Parámetro 'conjunto' debe ser 'A' o 'B'");
    }
  }

  static getInterception(arrA: number[], arrB: number[]) {
    return [...new Set(arrA.filter((item) => arrB.includes(item)))];
  }
}
