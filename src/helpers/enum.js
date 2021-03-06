export class Enum {
  constructor(enums) {
    this.enums = enums;
    this.values = Object.values(enums);
    for (const prop in enums) {
      if (enums.hasOwnProperty(prop)) {
        this[prop] = enums[prop];
      }
    }
  }

  getEnum = (id) => {
    return this.values.find((e) => e.id === id);
  };

  getName = (id) => {
    const en = this.values.find((e) => e.id === id);
    if (en) {
      return en.name;
    }
    return null;
  };

  getEnumByValue = (value, fromKey) => {
    return this.values.find((e) => e[fromKey || 'name'] === value);
  };

  getIds = () => {
    return this.values.map((e) => e.id);
  }
}

export const Days = new Enum({
  MONDAY: { id: 1, name: 'Monday', abbrev: 'Mon' },
  TUESDAY: { id: 2, name: 'Tuesday', abbrev: 'Tue' },
  WEDNESDAY: { id: 3, name: 'Wednesday', abbrev: 'Wed' },
  THURSDAY: { id: 4, name: 'Thursday', abbrev: 'Thu' },
  FRIDAY: { id: 5, name: 'Friday', abbrev: 'Fri' },
  SATURDAY: { id: 6, name: 'Saturday', abbrev: 'Sat' },
  // SUNDAY: { id: 7, name: 'Sunday', abbrev: 'Sun' }
});

export const Countries = new Enum({
  AFGHANISTAN: { id: 1, name: 'Afghanistan', description: 'Afghanistan' },
  ALBANIA: { id: 2, name: 'Albania', description: 'Albania' },
  ALGERIA: { id: 3, name: 'Algeria', description: 'Algeria' },
  AMERICAN_SAMOA: { id: 4, name: 'American Samoa', description: 'American Samoa' },
  ANDORRA: { id: 5, name: 'Andorra', description: 'Andorra' },
  ANGOLA: { id: 6, name: 'Angola', description: 'Angola' },
  ANGUILLA: { id: 7, name: 'Anguilla', description: 'Anguilla' },
  ANTARCTICA: { id: 8, name: 'Antarctica', description: 'Antarctica' },
  ANTIGUA_AND_BARBUDA: { id: 9, name: 'Antigua and Barbuda', description: 'Antigua and Barbuda' },
  ARGENTINA: { id: 10, name: 'Argentina', description: 'Argentina' },
  ARMENIA: { id: 11, name: 'Armenia', description: 'Armenia' },
  ARUBA: { id: 12, name: 'Aruba', description: 'Aruba' },
  AUSTRALIA: { id: 13, name: 'Australia', description: 'Australia' },
  AUSTRIA: { id: 14, name: 'Austria', description: 'Austria' },
  AZERBAIJAN: { id: 15, name: 'Azerbaijan', description: 'Azerbaijan' },
  BAHAMAS: { id: 16, name: 'Bahamas', description: 'Bahamas' },
  BAHRAIN: { id: 17, name: 'Bahrain', description: 'Bahrain' },
  BANGLADESH: { id: 18, name: 'Bangladesh', description: 'Bangladesh' },
  BARBADOS: { id: 19, name: 'Barbados', description: 'Barbados' },
  BELARUS: { id: 20, name: 'Belarus', description: 'Belarus' },
  BELGIUM: { id: 21, name: 'Belgium', description: 'Belgium' },
  BELIZE: { id: 22, name: 'Belize', description: 'Belize' },
  BENIN: { id: 23, name: 'Benin', description: 'Benin' },
  BERMUDA: { id: 24, name: 'Bermuda', description: 'Bermuda' },
  BHUTAN: { id: 25, name: 'Bhutan', description: 'Bhutan' },
  BOLIVIA: { id: 26, name: 'Bolivia', description: 'Bolivia' },
  BOSNIA_AND_HERZEGOVINA: { id: 27, name: 'Bosnia and Herzegovina', description: 'Bosnia and Herzegovina' },
  BOTSWANA: { id: 28, name: 'Botswana', description: 'Botswana' },
  BOUVET_ISLAND: { id: 29, name: 'Bouvet Island', description: 'Bouvet Island' },
  BRAZIL: { id: 30, name: 'Brazil', description: 'Brazil' },
  BRITISH_ANTARCTIC_TERRITORY: { id: 31, name: 'British Antarctic Territory', description: 'British Antarctic Territory' },
  BRITISH_INDIAN_OCEAN_TERRITORY: { id: 32, name: 'British Indian Ocean Territory', description: 'British Indian Ocean Territory' },
  BRITISH_VIRGIN_ISLANDS: { id: 33, name: 'British Virgin Islands', description: 'British Virgin Islands' },
  BRUNEI: { id: 34, name: 'Brunei', description: 'Brunei' },
  BULGARIA: { id: 35, name: 'Bulgaria', description: 'Bulgaria' },
  BURKINA_FASO: { id: 36, name: 'Burkina Faso', description: 'Burkina Faso' },
  BURUNDI: { id: 37, name: 'Burundi', description: 'Burundi' },
  CAMBODIA: { id: 38, name: 'Cambodia', description: 'Cambodia' },
  CAMEROON: { id: 39, name: 'Cameroon', description: 'Cameroon' },
  CANADA: { id: 40, name: 'Canada', description: 'Canada' },
  CANTON_AND_ENDERBURY_ISLANDS: { id: 41, name: 'Canton and Enderbury Islands', description: 'Canton and Enderbury Islands' },
  CAPE_VERDE: { id: 42, name: 'Cape Verde', description: 'Cape Verde' },
  CAYMAN_ISLANDS: { id: 43, name: 'Cayman Islands', description: 'Cayman Islands' },
  CENTRAL_AFRICAN_REPUBLIC: { id: 44, name: 'Central African Republic', description: 'Central African Republic' },
  CHAD: { id: 45, name: 'Chad', description: 'Chad' },
  CHILE: { id: 46, name: 'Chile', description: 'Chile' },
  CHINA: { id: 47, name: 'China', description: 'China' },
  CHRISTMAS_ISLAND: { id: 48, name: 'Christmas Island', description: 'Christmas Island' },
  COCOS_KEELING_ISLANDS: { id: 49, name: 'Cocos [Keeling] Islands', description: 'Cocos [Keeling] Islands' },
  COLOMBIA: { id: 50, name: 'Colombia', description: 'Colombia' },
  COMOROS: { id: 51, name: 'Comoros', description: 'Comoros' },
  CONGO_BRAZZAVILLE: { id: 52, name: 'Congo - Brazzaville', description: 'Congo - Brazzaville' },
  CONGO_KINSHASA: { id: 53, name: 'Congo - Kinshasa', description: 'Congo - Kinshasa' },
  COOK_ISLANDS: { id: 54, name: 'Cook Islands', description: 'Cook Islands' },
  COSTA_RICA: { id: 55, name: 'Costa Rica', description: 'Costa Rica' },
  CROATIA: { id: 56, name: 'Croatia', description: 'Croatia' },
  CUBA: { id: 57, name: 'Cuba', description: 'Cuba' },
  CYPRUS: { id: 58, name: 'Cyprus', description: 'Cyprus' },
  CZECH_REPUBLIC: { id: 59, name: 'Czech Republic', description: 'Czech Republic' },
  COTE_DIVOIRE: { id: 60, name: 'C??te d???Ivoire', description: 'C??te d???Ivoire' },
  DENMARK: { id: 61, name: 'Denmark', description: 'Denmark' },
  DJIBOUTI: { id: 62, name: 'Djibouti', description: 'Djibouti' },
  DOMINICA: { id: 63, name: 'Dominica', description: 'Dominica' },
  DOMINICAN_REPUBLIC: { id: 64, name: 'Dominican Republic', description: 'Dominican Republic' },
  DRONNING_MAUD_LAND: { id: 65, name: 'Dronning Maud Land', description: 'Dronning Maud Land' },
  EAST_GERMANY: { id: 66, name: 'East Germany', description: 'East Germany' },
  ECUADOR: { id: 67, name: 'Ecuador', description: 'Ecuador' },
  EGYPT: { id: 68, name: 'Egypt', description: 'Egypt' },
  EL_SALVADOR: { id: 69, name: 'El Salvador', description: 'El Salvador' },
  EQUATORIAL_GUINEA: { id: 70, name: 'Equatorial Guinea', description: 'Equatorial Guinea' },
  ERITREA: { id: 71, name: 'Eritrea', description: 'Eritrea' },
  ESTONIA: { id: 72, name: 'Estonia', description: 'Estonia' },
  ETHIOPIA: { id: 73, name: 'Ethiopia', description: 'Ethiopia' },
  FALKLAND_ISLANDS: { id: 74, name: 'Falkland Islands', description: 'Falkland Islands' },
  FAROE_ISLANDS: { id: 75, name: 'Faroe Islands', description: 'Faroe Islands' },
  FIJI: { id: 76, name: 'Fiji', description: 'Fiji' },
  FINLAND: { id: 77, name: 'Finland', description: 'Finland' },
  FRANCE: { id: 78, name: 'France', description: 'France' },
  FRENCH_GUIANA: { id: 79, name: 'French Guiana', description: 'French Guiana' },
  FRENCH_POLYNESIA: { id: 80, name: 'French Polynesia', description: 'French Polynesia' },
  FRENCH_SOUTHERN_TERRITORIES: { id: 81, name: 'French Southern Territories', description: 'French Southern Territories' },
  FRENCH_SOUTHERN_AND_ANTARCTIC_TERRITORIES: { id: 82, name: 'French Southern and Antarctic Territories', description: 'French Southern and Antarctic Territories' },
  GABON: { id: 83, name: 'Gabon', description: 'Gabon' },
  GAMBIA: { id: 84, name: 'Gambia', description: 'Gambia' },
  GEORGIA: { id: 85, name: 'Georgia', description: 'Georgia' },
  GERMANY: { id: 86, name: 'Germany', description: 'Germany' },
  GHANA: { id: 87, name: 'Ghana', description: 'Ghana' },
  GIBRALTAR: { id: 88, name: 'Gibraltar', description: 'Gibraltar' },
  GREECE: { id: 89, name: 'Greece', description: 'Greece' },
  GREENLAND: { id: 90, name: 'Greenland', description: 'Greenland' },
  GRENADA: { id: 91, name: 'Grenada', description: 'Grenada' },
  GUADELOUPE: { id: 92, name: 'Guadeloupe', description: 'Guadeloupe' },
  GUAM: { id: 93, name: 'Guam', description: 'Guam' },
  GUATEMALA: { id: 94, name: 'Guatemala', description: 'Guatemala' },
  GUERNSEY: { id: 95, name: 'Guernsey', description: 'Guernsey' },
  GUINEA: { id: 96, name: 'Guinea', description: 'Guinea' },
  GUINEA_BISSAU: { id: 97, name: 'Guinea-Bissau', description: 'Guinea-Bissau' },
  GUYANA: { id: 98, name: 'Guyana', description: 'Guyana' },
  HAITI: { id: 99, name: 'Haiti', description: 'Haiti' },
  HEARD_ISLAND_AND_MCDONALD_ISLANDS: { id: 100, name: 'Heard Island and McDonald Islands', description: 'Heard Island and McDonald Islands' },
  HONDURAS: { id: 101, name: 'Honduras', description: 'Honduras' },
  HONG_KONG_SAR_CHINA: { id: 102, name: 'Hong Kong SAR China', description: 'Hong Kong SAR China' },
  HUNGARY: { id: 103, name: 'Hungary', description: 'Hungary' },
  ICELAND: { id: 104, name: 'Iceland', description: 'Iceland' },
  INDIA: { id: 105, name: 'India', description: 'India' },
  INDONESIA: { id: 106, name: 'Indonesia', description: 'Indonesia' },
  IRAN: { id: 107, name: 'Iran', description: 'Iran' },
  IRAQ: { id: 108, name: 'Iraq', description: 'Iraq' },
  IRELAND: { id: 109, name: 'Ireland', description: 'Ireland' },
  ISLE_OF_MAN: { id: 110, name: 'Isle of Man', description: 'Isle of Man' },
  ISRAEL: { id: 111, name: 'Israel', description: 'Israel' },
  ITALY: { id: 112, name: 'Italy', description: 'Italy' },
  JAMAICA: { id: 113, name: 'Jamaica', description: 'Jamaica' },
  JAPAN: { id: 114, name: 'Japan', description: 'Japan' },
  JERSEY: { id: 115, name: 'Jersey', description: 'Jersey' },
  JOHNSTON_ISLAND: { id: 116, name: 'Johnston Island', description: 'Johnston Island' },
  JORDAN: { id: 117, name: 'Jordan', description: 'Jordan' },
  KAZAKHSTAN: { id: 118, name: 'Kazakhstan', description: 'Kazakhstan' },
  KENYA: { id: 119, name: 'Kenya', description: 'Kenya' },
  KIRIBATI: { id: 120, name: 'Kiribati', description: 'Kiribati' },
  KUWAIT: { id: 121, name: 'Kuwait', description: 'Kuwait' },
  KYRGYZSTAN: { id: 122, name: 'Kyrgyzstan', description: 'Kyrgyzstan' },
  LAOS: { id: 123, name: 'Laos', description: 'Laos' },
  LATVIA: { id: 124, name: 'Latvia', description: 'Latvia' },
  LEBANON: { id: 125, name: 'Lebanon', description: 'Lebanon' },
  LESOTHO: { id: 126, name: 'Lesotho', description: 'Lesotho' },
  LIBERIA: { id: 127, name: 'Liberia', description: 'Liberia' },
  LIBYA: { id: 128, name: 'Libya', description: 'Libya' },
  LIECHTENSTEIN: { id: 129, name: 'Liechtenstein', description: 'Liechtenstein' },
  LITHUANIA: { id: 130, name: 'Lithuania', description: 'Lithuania' },
  LUXEMBOURG: { id: 131, name: 'Luxembourg', description: 'Luxembourg' },
  MACAU_SAR_CHINA: { id: 132, name: 'Macau SAR China', description: 'Macau SAR China' },
  MACEDONIA: { id: 133, name: 'Macedonia', description: 'Macedonia' },
  MADAGASCAR: { id: 134, name: 'Madagascar', description: 'Madagascar' },
  MALAWI: { id: 135, name: 'Malawi', description: 'Malawi' },
  MALAYSIA: { id: 136, name: 'Malaysia', description: 'Malaysia' },
  MALDIVES: { id: 137, name: 'Maldives', description: 'Maldives' },
  MALI: { id: 138, name: 'Mali', description: 'Mali' },
  MALTA: { id: 139, name: 'Malta', description: 'Malta' },
  MARSHALL_ISLANDS: { id: 140, name: 'Marshall Islands', description: 'Marshall Islands' },
  MARTINIQUE: { id: 141, name: 'Martinique', description: 'Martinique' },
  MAURITANIA: { id: 142, name: 'Mauritania', description: 'Mauritania' },
  MAURITIUS: { id: 143, name: 'Mauritius', description: 'Mauritius' },
  MAYOTTE: { id: 144, name: 'Mayotte', description: 'Mayotte' },
  METROPOLITAN_FRANCE: { id: 145, name: 'Metropolitan France', description: 'Metropolitan France' },
  MEXICO: { id: 146, name: 'Mexico', description: 'Mexico' },
  MICRONESIA: { id: 147, name: 'Micronesia', description: 'Micronesia' },
  MIDWAY_ISLANDS: { id: 148, name: 'Midway Islands', description: 'Midway Islands' },
  MOLDOVA: { id: 149, name: 'Moldova', description: 'Moldova' },
  MONACO: { id: 150, name: 'Monaco', description: 'Monaco' },
  MONGOLIA: { id: 151, name: 'Mongolia', description: 'Mongolia' },
  MONTENEGRO: { id: 152, name: 'Montenegro', description: 'Montenegro' },
  MONTSERRAT: { id: 153, name: 'Montserrat', description: 'Montserrat' },
  MOROCCO: { id: 154, name: 'Morocco', description: 'Morocco' },
  MOZAMBIQUE: { id: 155, name: 'Mozambique', description: 'Mozambique' },
  MYANMAR_BURMA: { id: 156, name: 'Myanmar Burma', description: 'Myanmar Burma' },
  NAMIBIA: { id: 157, name: 'Namibia', description: 'Namibia' },
  NAURU: { id: 158, name: 'Nauru', description: 'Nauru' },
  NEPAL: { id: 159, name: 'Nepal', description: 'Nepal' },
  NETHERLANDS: { id: 160, name: 'Netherlands', description: 'Netherlands' },
  NETHERLANDS_ANTILLES: { id: 161, name: 'Netherlands Antilles', description: 'Netherlands Antilles' },
  NEUTRAL_ZONE: { id: 162, name: 'Neutral Zone', description: 'Neutral Zone' },
  NEW_CALEDONIA: { id: 163, name: 'New Caledonia', description: 'New Caledonia' },
  NEW_ZEALAND: { id: 164, name: 'New Zealand', description: 'New Zealand' },
  NICARAGUA: { id: 165, name: 'Nicaragua', description: 'Nicaragua' },
  NIGER: { id: 166, name: 'Niger', description: 'Niger' },
  NIGERIA: { id: 167, name: 'Nigeria', description: 'Nigeria' },
  NIUE: { id: 168, name: 'Niue', description: 'Niue' },
  NORFOLK_ISLAND: { id: 169, name: 'Norfolk Island', description: 'Norfolk Island' },
  NORTH_KOREA: { id: 170, name: 'North Korea', description: 'North Korea' },
  NORTH_VIETNAM: { id: 171, name: 'North Vietnam', description: 'North Vietnam' },
  NORTHERN_MARIANA_ISLANDS: { id: 172, name: 'Northern Mariana Islands', description: 'Northern Mariana Islands' },
  NORWAY: { id: 173, name: 'Norway', description: 'Norway' },
  OMAN: { id: 174, name: 'Oman', description: 'Oman' },
  PACIFIC_ISLANDS_TRUST_TERRITORY: { id: 175, name: 'Pacific Islands Trust Territory', description: 'Pacific Islands Trust Territory' },
  PAKISTAN: { id: 176, name: 'Pakistan', description: 'Pakistan' },
  PALAU: { id: 177, name: 'Palau', description: 'Palau' },
  PALESTINIAN_TERRITORIES: { id: 178, name: 'Palestinian Territories', description: 'Palestinian Territories' },
  PANAMA: { id: 179, name: 'Panama', description: 'Panama' },
  PANAMA_CANAL_ZONE: { id: 180, name: 'Panama Canal Zone', description: 'Panama Canal Zone' },
  PAPUA_NEW_GUINEA: { id: 181, name: 'Papua New Guinea', description: 'Papua New Guinea' },
  PARAGUAY: { id: 182, name: 'Paraguay', description: 'Paraguay' },
  PEOPLES_DEMOCRATIC_REPUBLIC_OF_YEMEN: { id: 183, name: 'People\'s Democratic Republic of Yemen', description: 'People\'s Democratic Republic of Yemen' },
  PERU: { id: 184, name: 'Peru', description: 'Peru' },
  PHILIPPINES: { id: 185, name: 'Philippines', description: 'Philippines' },
  PITCAIRN_ISLANDS: { id: 186, name: 'Pitcairn Islands', description: 'Pitcairn Islands' },
  POLAND: { id: 187, name: 'Poland', description: 'Poland' },
  PORTUGAL: { id: 188, name: 'Portugal', description: 'Portugal' },
  PUERTO_RICO: { id: 189, name: 'Puerto Rico', description: 'Puerto Rico' },
  QATAR: { id: 190, name: 'Qatar', description: 'Qatar' },
  ROMANIA: { id: 191, name: 'Romania', description: 'Romania' },
  RUSSIA: { id: 192, name: 'Russia', description: 'Russia' },
  RWANDA: { id: 193, name: 'Rwanda', description: 'Rwanda' },
  REUNION: { id: 194, name: 'R??union', description: 'R??union' },
  SAINT_BARTH??LEMY: { id: 195, name: 'Saint Barth??lemy', description: 'Saint Barth??lemy' },
  SAINT_HELENA: { id: 196, name: 'Saint Helena', description: 'Saint Helena' },
  SAINT_KITTS_AND_NEVIS: { id: 197, name: 'Saint Kitts and Nevis', description: 'Saint Kitts and Nevis' },
  SAINT_LUCIA: { id: 198, name: 'Saint Lucia', description: 'Saint Lucia' },
  SAINT_MARTIN: { id: 199, name: 'Saint Martin', description: 'Saint Martin' },
  SAINT_PIERRE_AND_MIQUELON: { id: 200, name: 'Saint Pierre and Miquelon', description: 'Saint Pierre and Miquelon' },
  SAINT_VINCENT_AND_THE_GRENADINES: { id: 201, name: 'Saint Vincent and the Grenadines', description: 'Saint Vincent and the Grenadines' },
  SAMOA: { id: 202, name: 'Samoa', description: 'Samoa' },
  SAN_MARINO: { id: 203, name: 'San Marino', description: 'San Marino' },
  SAUDI_ARABIA: { id: 204, name: 'Saudi Arabia', description: 'Saudi Arabia' },
  SENEGAL: { id: 205, name: 'Senegal', description: 'Senegal' },
  SERBIA: { id: 206, name: 'Serbia', description: 'Serbia' },
  SERBIA_AND_MONTENEGRO: { id: 207, name: 'Serbia and Montenegro', description: 'Serbia and Montenegro' },
  SEYCHELLES: { id: 208, name: 'Seychelles', description: 'Seychelles' },
  SIERRA_LEONE: { id: 209, name: 'Sierra Leone', description: 'Sierra Leone' },
  SINGAPORE: { id: 210, name: 'Singapore', description: 'Singapore' },
  SLOVAKIA: { id: 211, name: 'Slovakia', description: 'Slovakia' },
  SLOVENIA: { id: 212, name: 'Slovenia', description: 'Slovenia' },
  SOLOMON_ISLANDS: { id: 213, name: 'Solomon Islands', description: 'Solomon Islands' },
  SOMALIA: { id: 214, name: 'Somalia', description: 'Somalia' },
  SOUTH_AFRICA: { id: 215, name: 'South Africa', description: 'South Africa' },
  SOUTH_GEORGIA_AND_THE_SOUTH_SANDWICH_ISLANDS: { id: 216, name: 'South Georgia and the South Sandwich Islands', description: 'South Georgia and the South Sandwich Islands' },
  SOUTH_KOREA: { id: 217, name: 'South Korea', description: 'South Korea' },
  SPAIN: { id: 218, name: 'Spain', description: 'Spain' },
  SRI_LANKA: { id: 219, name: 'Sri Lanka', description: 'Sri Lanka' },
  SUDAN: { id: 220, name: 'Sudan', description: 'Sudan' },
  SURINAME: { id: 221, name: 'Suriname', description: 'Suriname' },
  SVALBARD_AND_JAN_MAYEN: { id: 222, name: 'Svalbard and Jan Mayen', description: 'Svalbard and Jan Mayen' },
  SWAZILAND: { id: 223, name: 'Swaziland', description: 'Swaziland' },
  SWEDEN: { id: 224, name: 'Sweden', description: 'Sweden' },
  SWITZERLAND: { id: 225, name: 'Switzerland', description: 'Switzerland' },
  SYRIA: { id: 226, name: 'Syria', description: 'Syria' },
  SAO_TOM??_AND_PR??NCIPE: { id: 227, name: 'S??o Tom?? and Pr??ncipe', description: 'S??o Tom?? and Pr??ncipe' },
  TAIWAN: { id: 228, name: 'Taiwan', description: 'Taiwan' },
  TAJIKISTAN: { id: 229, name: 'Tajikistan', description: 'Tajikistan' },
  TANZANIA: { id: 230, name: 'Tanzania', description: 'Tanzania' },
  THAILAND: { id: 231, name: 'Thailand', description: 'Thailand' },
  TIMOR_LESTE: { id: 232, name: 'Timor-Leste', description: 'Timor-Leste' },
  TOGO: { id: 233, name: 'Togo', description: 'Togo' },
  TOKELAU: { id: 234, name: 'Tokelau', description: 'Tokelau' },
  TONGA: { id: 235, name: 'Tonga', description: 'Tonga' },
  TRINIDAD_AND_TOBAGO: { id: 236, name: 'Trinidad and Tobago', description: 'Trinidad and Tobago' },
  TUNISIA: { id: 237, name: 'Tunisia', description: 'Tunisia' },
  TURKEY: { id: 238, name: 'Turkey', description: 'Turkey' },
  TURKMENISTAN: { id: 239, name: 'Turkmenistan', description: 'Turkmenistan' },
  TURKS_AND_CAICOS_ISLANDS: { id: 240, name: 'Turks and Caicos Islands', description: 'Turks and Caicos Islands' },
  TUVALU: { id: 241, name: 'Tuvalu', description: 'Tuvalu' },
  US_MINOR_OUTLYING_ISLANDS: { id: 242, name: 'U.S. Minor Outlying Islands', description: 'U.S. Minor Outlying Islands' },
  US_MISCELLANEOUS_PACIFIC_ISLANDS: { id: 243, name: 'U.S. Miscellaneous Pacific Islands', description: 'U.S. Miscellaneous Pacific Islands' },
  US_VIRGIN_ISLANDS: { id: 244, name: 'U.S. Virgin Islands', description: 'U.S. Virgin Islands' },
  UGANDA: { id: 245, name: 'Uganda', description: 'Uganda' },
  UKRAINE: { id: 246, name: 'Ukraine', description: 'Ukraine' },
  UNION_OF_SOVIET_SOCIALIST_REPUBLICS: { id: 247, name: 'Union of Soviet Socialist Republics', description: 'Union of Soviet Socialist Republics' },
  UNITED_ARAB_EMIRATES: { id: 248, name: 'United Arab Emirates', description: 'United Arab Emirates' },
  UNITED_KINGDOM: { id: 249, name: 'United Kingdom', description: 'United Kingdom' },
  UNITED_STATES: { id: 250, name: 'United States', description: 'United States' },
  UNKNOWN_OR_INVALID_REGION: { id: 251, name: 'Unknown or Invalid Region', description: 'Unknown or Invalid Region' },
  URUGUAY: { id: 252, name: 'Uruguay', description: 'Uruguay' },
  UZBEKISTAN: { id: 253, name: 'Uzbekistan', description: 'Uzbekistan' },
  VANUATU: { id: 254, name: 'Vanuatu', description: 'Vanuatu' },
  VATICAN_CITY: { id: 255, name: 'Vatican City', description: 'Vatican City' },
  VENEZUELA: { id: 256, name: 'Venezuela', description: 'Venezuela' },
  VIETNAM: { id: 257, name: 'Vietnam', description: 'Vietnam' },
  WAKE_ISLAND: { id: 258, name: 'Wake Island', description: 'Wake Island' },
  WALLIS_AND_FUTUNA: { id: 259, name: 'Wallis and Futuna', description: 'Wallis and Futuna' },
  WESTERN_SAHARA: { id: 260, name: 'Western Sahara', description: 'Western Sahara' },
  YEMEN: { id: 261, name: 'Yemen', description: 'Yemen' },
  ZAMBIA: { id: 262, name: 'Zambia', description: 'Zambia' },
  ZIMBABWE: { id: 263, name: 'Zimbabwe', description: 'Zimbabwe' }
});



export const Months = new Enum({
  JANUARY: { id: 1, name: 'January' },
  FEBRUARY: { id: 2, name: 'February' },
  MARCH: { id: 3, name: 'March' },
  APRIL: { id: 4, name: 'April' },
  MAY: { id: 5, name: 'May' },
  JUNE: { id: 6, name: 'June' },
  JULY: { id: 7, name: 'July' },
  AUGUST: { id: 8, name: 'August' },
  SEPTEMBER: { id: 9, name: 'September' },
  OCTOBER: { id: 10, name: 'October' },
  NOVEMBER: { id: 11, name: 'November' },
  DECEMBER: { id: 12, name: 'December' }
});

export const UserGroups = new Enum({
  SUPER_USER: { id: 1, name: 'Super Users' },
})

export const ContractStatuses = new Enum( {
  PENDING: { id: 1, name: 'Pending'},
  APPROVED: { id: 2, name: 'Approved'},
  INACTIVE: { id: 3, name: 'Inactive'}
})

export const PaymentTypes = new Enum( {
  CASH: { id: 1, name: 'Cash'},
  CHEQUE: { id: 2, name: 'Cheque'},
  BANK_DEPOSIT: { id: 3, name: 'Bank Deposit'},
  EWALLET: { id: 4, name: 'E Wallet'}
})

export const PaymentStatuses = new Enum( {
  PENDING: { id: 1, name: 'Pending'},
  APPROVED: { id: 2, name: 'Approved'},
})

export const DisbursementStatuses = new Enum( {
  PENDING: { id: 1, name: 'Pending'},
  APPROVED: { id: 2, name: 'Approved'},
  REJECTED: { id: 3, name: 'Rejected'},
})

export const BillingStatuses = new Enum( {
  PENDING: { id: 1, name: 'Pending'},
  APPROVED: { id: 2, name: 'Approved'}
})

export const ApprovalPermissions = new Enum({
  CONTRACT: { id: 1, name: 'Contract' },
  DISBURSEMENT: { id: 2, name: 'Disbursement' },
  COLLECTION: { id: 3, name: 'Collection' },
})

export const BillingPermissions = new Enum({
  ADD: { id: 11, name: 'Add' },
  EDIT: { id: 12, name: 'Edit' },
  DELETE: { id: 13, name: 'Delete' },
})

export const PaymentPermissions = new Enum({
  ADD: { id: 21, name: 'Add' },
  EDIT: { id: 22, name: 'Edit' },
  DELETE: { id: 23, name: 'Delete' },
})

export const DisbursementPermissions = new Enum({
  ADD: { id: 31, name: 'Add' },
  EDIT: { id: 32, name: 'Edit' },
  DELETE: { id: 33, name: 'Delete' },
})

export const ClientPermissions = new Enum({
  ADD: { id: 41, name: 'Add' },
  EDIT: { id: 42, name: 'Edit' },
  DELETE: { id: 43, name: 'Delete' },
})

export const ContractPermissions = new Enum({
  ADD: { id: 51, name: 'Add' },
  EDIT: { id: 52, name: 'Edit' },
  DELETE: { id: 53, name: 'Delete' },
})

export const ServiceCategoryPermissions = new Enum({
  ADD: { id: 61, name: 'Add' },
  EDIT: { id: 62, name: 'Edit' },
  DELETE: { id: 63, name: 'Delete' },
})

export const ServicePermissions = new Enum({
  ADD: { id: 71, name: 'Add' },
  EDIT: { id: 72, name: 'Edit' },
  DELETE: { id: 73, name: 'Delete' },
})

export const DocumentTypePermissions = new Enum({
  ADD: { id: 81, name: 'Add' },
  EDIT: { id: 82, name: 'Edit' },
  DELETE: { id: 83, name: 'Delete' },
})

export const BusinessStylePermissions = new Enum({
  ADD: { id: 91, name: 'Add' },
  EDIT: { id: 92, name: 'Edit' },
  DELETE: { id: 93, name: 'Delete' },
})

export const BusinessTypePermissions = new Enum({
  ADD: { id: 101, name: 'Add' },
  EDIT: { id: 102, name: 'Edit' },
  DELETE: { id: 103, name: 'Delete' },
})

export const AccountTypePermissions = new Enum({
  ADD: { id: 111, name: 'Add' },
  EDIT: { id: 112, name: 'Edit' },
  DELETE: { id: 113, name: 'Delete' },
})

export const AccountClassPermissions = new Enum({
  ADD: { id: 121, name: 'Add' },
  EDIT: { id: 122, name: 'Edit' },
  DELETE: { id: 123, name: 'Delete' },
})

export const AccountTitlePermissions = new Enum({
  ADD: { id: 131, name: 'Add' },
  EDIT: { id: 132, name: 'Edit' },
  DELETE: { id: 133, name: 'Delete' },
})

export const ChargePermissions = new Enum({
  ADD: { id: 141, name: 'Add' },
  EDIT: { id: 142, name: 'Edit' },
  DELETE: { id: 143, name: 'Delete' },
})

export const RDOPermissions = new Enum({
  ADD: { id: 151, name: 'Add' },
  EDIT: { id: 152, name: 'Edit' },
  DELETE: { id: 153, name: 'Delete' },
})

export const LocationPermissions = new Enum({
  ADD: { id: 161, name: 'Add' },
  EDIT: { id: 162, name: 'Edit' },
  DELETE: { id: 163, name: 'Delete' },
})

export const TaxTypePermissions = new Enum({
  ADD: { id: 171, name: 'Add' },
  EDIT: { id: 172, name: 'Edit' },
  DELETE: { id: 173, name: 'Delete' },
})

export const PersonnelPermissions = new Enum({
  ADD: { id: 181, name: 'Add' },
  EDIT: { id: 182, name: 'Edit' },
  DELETE: { id: 183, name: 'Delete' },
})

export const UserGroupPermissions = new Enum({
  ADD: { id: 191, name: 'Add' },
  EDIT: { id: 192, name: 'Edit' },
  DELETE: { id: 193, name: 'Delete' },
})

export const BankPermissions = new Enum({
  ADD: { id: 201, name: 'Add' },
  EDIT: { id: 202, name: 'Edit' },
  DELETE: { id: 203, name: 'Delete' },
})

export const EwalletPermissions = new Enum({
  ADD: { id: 211, name: 'Add' },
  EDIT: { id: 212, name: 'Edit' },
  DELETE: { id: 213, name: 'Delete' },
})
