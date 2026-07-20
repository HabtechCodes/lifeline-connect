export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  phone: string;
  city: string;
}

export const DONORS: Donor[] = [
  { id: "1", name: "John Doe", bloodGroup: "A+", phone: "+234 803 123 4567", city: "Lagos" },
  { id: "2", name: "Jane Smith", bloodGroup: "O-", phone: "+234 805 765 4321", city: "Abuja" },
  { id: "3", name: "Michael Ade", bloodGroup: "B+", phone: "+234 802 345 6789", city: "Lagos" },
  { id: "4", name: "Sarah Okafor", bloodGroup: "AB-", phone: "+234 806 987 6543", city: "Port Harcourt" },
  { id: "5", name: "David Kim", bloodGroup: "O+", phone: "+234 809 111 2222", city: "Kano" },
  { id: "6", name: "Fatima Bello", bloodGroup: "A-", phone: "+234 701 333 4444", city: "Ibadan" },
  { id: "7", name: "Chidi Nwosu", bloodGroup: "B-", phone: "+234 805 555 6666", city: "Lagos" },
  { id: "8", name: "Grace Mensah", bloodGroup: "AB+", phone: "+234 807 777 8888", city: "Abuja" },
  { id: "9", name: "Yusuf Ibrahim", bloodGroup: "O-", phone: "+234 708 999 0000", city: "Kano" },
  { id: "10", name: "Blessing Eze", bloodGroup: "A+", phone: "+234 810 222 3333", city: "Benin City" },
  { id: "11", name: "Emmanuel Ojo", bloodGroup: "B+", phone: "+234 803 444 5555", city: "Port Harcourt" },
  { id: "12", name: "Amina Sani", bloodGroup: "O+", phone: "+234 806 666 7777", city: "Abuja" },
  { id: "13", name: "Peter Obi", bloodGroup: "AB-", phone: "+234 702 888 9999", city: "Lagos" },
  { id: "14", name: "Ngozi Uzo", bloodGroup: "B-", phone: "+234 809 000 1111", city: "Enugu" },
  { id: "15", name: "Samuel Okon", bloodGroup: "A+", phone: "+234 805 234 5678", city: "Kaduna" },
  { id: "16", name: "Hadiza Musa", bloodGroup: "O-", phone: "+234 708 876 5432", city: "Ibadan" },
  { id: "17", name: "Daniel Kofi", bloodGroup: "A-", phone: "+233 24 123 4567", city: "Accra" },
  { id: "18", name: "Ama Serwaa", bloodGroup: "B+", phone: "+233 55 987 6543", city: "Kumasi" },
  { id: "19", name: "Kwame Boateng", bloodGroup: "O+", phone: "+233 20 555 7777", city: "Accra" },
  { id: "20", name: "Zara Ali", bloodGroup: "AB+", phone: "+254 712 345 678", city: "Nairobi" },
  { id: "21", name: "Tom Mwangi", bloodGroup: "B-", phone: "+254 723 987 654", city: "Mombasa" },
  { id: "22", name: "Linda Wanjiku", bloodGroup: "O-", phone: "+254 701 222 333", city: "Nairobi" },
  { id: "23", name: "James Otieno", bloodGroup: "A+", phone: "+254 711 444 555", city: "Mombasa" },
  { id: "24", name: "Mary Njeri", bloodGroup: "AB-", phone: "+254 722 666 888", city: "Nairobi" },
];
