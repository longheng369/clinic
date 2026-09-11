export const getGazetteerInfo = (gazetteerCode: string | number) => {
  const code = String(gazetteerCode);
  const isEven = code.length % 2 === 0;

  let result: string[] = [];

  if (isEven) {
    result = code.match(/.{1,2}/g) || [];
  } else {
    result = [code[0], ...(code.slice(1).match(/.{1,2}/g) || [])];
  }

  return {
    province: result[0] ?? '',
    district: result[0] && result[1] ? `${result[0]}${result[1]}` : '',
    commune:
      result[0] && result[1] && result[2]
        ? `${result[0]}${result[1]}${result[2]}`
        : '',
    village:
      result[0] && result[1] && result[2] && result[3]
        ? `${result[0]}${result[1]}${result[2]}${result[3]}`
        : '',
  };
};
