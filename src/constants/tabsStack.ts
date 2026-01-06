import { ImageSourcePropType } from "react-native";
import images from "../config/images";



export interface ITabStack {
    name: string;
    image: ImageSourcePropType;
    navigation: string;
}
export const TabStackArray: ITabStack[] = [
    {
        name: 'Hotel',
        image: images.home_tab,
        navigation: "Accomodation"
    },
    {
        name: 'Food',
        image: images.food_tab,
        navigation: "Food"
    },
    {
        name: 'Car Hire',
        image: images.car,
        navigation: "Car"
    },
    {
        name: 'Profile',
        image: images.user,
        navigation: "Profile"
    },
]