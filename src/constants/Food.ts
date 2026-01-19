import { ImageURISource } from "react-native";
import images from "../config/images"
import labels from "../config/labels"

export interface FoodCard {
    id: string,
    icon: string,
    title: string
}

export interface FoodListCardType {
    banner: string,
    createdAt: string,
    deliveryRadius: string,
    description: string,
    id: number | string,
    logo: string,
    name: string,
}

export type MenuItem = {
    category: string;
    description: string;
    id: number;
    image: string;
    isActive: number;
    name: string;
    price: number;
}

export type RestaurantMenu = {
    banner: string | ImageURISource;
    cheapestItem: MenuItem;
    deliveryRadius: string;
    description: string;
    id: number;
    isActive: boolean
    location: string;
    logo: string | ImageURISource;
    menues: { title: string, data: MenuItem[] }[];
    name: string;
    ownerId: number;
    phoneNumber: string;
    timings: string[];
}

export const FoodIconListArray: FoodCard[] = [
    {
        id: "1",
        icon: images.near_me,
        title: labels.singleRoom
    },
    {
        id: "2",
        icon: images.big_promo,
        title: labels.studios
    },
    {
        id: "3",
        icon: images.best_seller,
        title: labels.appartment
    },
    {
        id: "4",
        icon: images.meals,
        title: labels.condos
    }

]

export const FoodCardList: ({ id: string, image: string, title: string, time: string, discount: number })[] = [
    {
        id: "1",
        image: 'https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg',
        title: "Mc Donald’s",
        time: "10:00 AM - 11:00 AM",
        discount: 10
    },
    {
        id: "1",
        image: 'https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg',
        title: "Mc Donald’s",
        time: "10:00 AM - 11:00 AM",
        discount: 10
    },
    {
        id: "1",
        image: 'https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg',
        title: "Mc Donald’s",
        time: "10:00 AM - 11:00 AM",
        discount: 10
    },
    {
        id: "1",
        image: 'https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg',
        title: "Mc Donald’s",
        time: "10:00 AM - 11:00 AM",
        discount: 10
    },
    {
        id: "1",
        image: 'https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg',
        title: "Mc Donald’s",
        time: "10:00 AM - 11:00 AM",
        discount: 10
    }
]
