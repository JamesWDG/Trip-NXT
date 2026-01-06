import images from "../config/images";
import labels from "../config/labels";
export interface IOption {
    id: number,
    title: string;
    image: any;
    selected?: boolean
}
export const options: IOption[] = [
    {
        id: 0,
        title: labels.bookARide,
        image: images.bookARide
    },
    {
        id: 1,
        title: labels.orderFood,
        image: images.foodOrder
    },
    {
        id: 2,
        title: labels.bookYourPlace,
        image: images.bookYourPlace
    }
]