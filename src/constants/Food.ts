import images from "../config/images"
import labels from "../config/labels"

export interface FoodCard {
    id: string,
    icon: string,
    title: string
}

export interface FoodListCardType {
    id: string,
    image: string,
    title: string
    discount: number,
    time: string
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


export const FoodCardList: FoodListCardType[] = [
    {
        id: "1",
        image: images.newly_opened,
        title: "Mc Donald’s",
        time: "10:00 AM - 11:00 AM",
        discount: 10
    },
    {
        id: "1",
        image: images.newly_opened,
        title: "Mc Donald’s",
        time: "10:00 AM - 11:00 AM",
        discount: 10
    },
    {
        id: "1",
        image: images.newly_opened,
        title: "Mc Donald’s",
        time: "10:00 AM - 11:00 AM",
        discount: 10
    },
    {
        id: "1",
        image: images.newly_opened,
        title: "Mc Donald’s",
        time: "10:00 AM - 11:00 AM",
        discount: 10
    },
    {
        id: "1",
        image: images.newly_opened,
        title: "Mc Donald’s",
        time: "10:00 AM - 11:00 AM",
        discount: 10
    }
]