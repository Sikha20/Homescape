export type TPageProps = {
  params: Promise<{
    id: string;
  }>;
};
export type TPagePropsPageNumber = {
  searchParams: Promise<{
    page: string;
    email: string;
  }>;
};
export type TManageListingsPageProp = {
  searchParams?: Promise<{
    amount?: string;
    total_amount?: string;
    bank_reference?: string;
    idx?: string;
    mobile?: string;
    pidx?: string;
    purchase_order_id?: string;
    purchase_order_name?: string;
    status?: string;
    t?: string;
    tidx?: string;
    token?: string;
    transaction_id?: string;
  }>;
};

export type TSearchParams = {
  searchParams: Promise<{
    location?: Location;
    category?: PropertyType;
    noOfRooms?: number;
    noOfBathrooms?: number;
    sort?: "asc" | "desc";
  }>;
};
export type PropertyType =
  | "HOUSE"
  | "APARTMENT"
  | "VILLA"
  | "COMMERCIAL_SPACE"
  | "ROOM";

export type Location =
  | "Kathmandu"
  | "Pokhara"
  | "Lalitpur"
  | "Bhaktapur"
  | "Biratnagar"
  | "Birgunj"
  | "Dharan"
  | "Nepalgunj"
  | "Butwal"
  | "Dhangadhi"
  | "Itahari"
  | "Hetauda"
  | "Janakpur"
  | "Bharatpur"
  | "Chitwan"
  | "Lumbini"
  | "Gorkha"
  | "Ilam"
  | "Tansen"
  | "Dhulikhel";

export type Image = {
  id: string;
  propertyId: string;
  image: string;
};

export type Email = {
  id: string;
  email: string;
  userId: string;
};

export type Landlord = {
  userId: string;
  name: string;
  profileUrl: string;
  createdAt: Date;
  updatedAt: Date;
  emails: Email[];
};
export type Rentals = {
  id: string;
  propertyId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TProperty = {
  id: string;
  userId: string;
  location: string;
  isListed: boolean;
  isBooked: boolean;
  price: number;
  category: string;
  noOfRooms: number | null;
  noOfBathrooms: number | null;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  images: Image[];
  landlord: {
    userId: string;
    name: string | null;
    profileUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    emails?: {
      id: string;
      userId: string;
      email: string;
    }[];
  };
  Rental: {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    propertyId: string;
  }[];
} | null;
