// src/lib/size-conversion.ts
type SizeConversion = {
    us: string;
    uk: string;
    eu: string;
  };
  
  export const shoeSizes: SizeConversion[] = [
    { us: '4', uk: '3.5', eu: '36' },
    { us: '4.5', uk: '4', eu: '36.5' },
    { us: '5', uk: '4.5', eu: '37.5' },
    { us: '5.5', uk: '5', eu: '38' },
    { us: '6', uk: '5.5', eu: '38.5' },
    { us: '6.5', uk: '6', eu: '39' },
    { us: '7', uk: '6', eu: '40' },
    { us: '7.5', uk: '6.5', eu: '40.5' },
    { us: '8', uk: '7', eu: '41' },
    { us: '8.5', uk: '7.5', eu: '42' },
    { us: '9', uk: '8', eu: '42.5' },
    { us: '9.5', uk: '8.5', eu: '43' },
    { us: '10', uk: '9', eu: '44' },
    { us: '10.5', uk: '9.5', eu: '44.5' },
    { us: '11', uk: '10', eu: '45' },
    { us: '11.5', uk: '10.5', eu: '45.5' },
    { us: '12', uk: '11', eu: '46' },
    { us: '12.5', uk: '11.5', eu: '47' },
    { us: '13', uk: '12', eu: '47.5' },
    { us: '14', uk: '13', eu: '48.5' },
    { us: '15', uk: '14', eu: '49.5' },
  ];
  
  export const conditionOptions = [
    { value: 'DS', label: 'Deadstock (DS)' },
    { value: 'VNDS', label: 'Very Near Deadstock (VNDS)' },
    { value: '10', label: '10 - Like new' },
    { value: '9', label: '9 - Excellent' },
    { value: '8', label: '8 - Great' },
    { value: '7', label: '7 - Good' },
    { value: '6', label: '6 - Acceptable' },
    { value: '5', label: '5 - Worn' },
    { value: '4', label: '4 - Very worn' },
    { value: '3', label: '3 - Heavily worn' },
    { value: '2', label: '2 - Poor' },
    { value: '1', label: '1 - Very poor' },
  ];
  
  export function getSizeConversions(usSize: string): SizeConversion | undefined {
    return shoeSizes.find((size) => size.us === usSize);
  }