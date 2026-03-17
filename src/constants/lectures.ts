export const lectureNames: Record<string, string> = {
  "Lec8-Ethernet": "Lec 8 \u00b7 Ethernet & Data Link",
  "Lec9A-NetworkLayer": "Lec 9A \u00b7 Network Layer & IPv4",
  "Lec9B-Subnetting": "Lec 9B \u00b7 Subnetting & VLSM",
  "Lec10-VLAN": "Lec 10 \u00b7 VLAN, DHCP & IPv6",
  "Lec11-Routing": "Lec 11 \u00b7 Routing",
  "Lec12-Transport": "Lec 12 \u00b7 Transport & App Layer",
  "Guideline-IOS": "Guideline \u00b7 Cisco IOS",
  "Guideline-VLAN": "Guideline \u00b7 VLAN Config",
  "Guideline-Routing": "Guideline \u00b7 RIP & OSPF",
  "Guideline-Redistribution": "Guideline \u00b7 Redistribution",
  "Guideline-ACL": "Guideline \u00b7 ACL",
};

export const lectureOrder = [
  "Lec8-Ethernet",
  "Lec9A-NetworkLayer",
  "Lec9B-Subnetting",
  "Lec10-VLAN",
  "Lec11-Routing",
  "Lec12-Transport",
];

export function getLectureName(key: string): string {
  return lectureNames[key] || key;
}
