import images from "../config/images";

export interface ISlider {
    key: number;
    title: string;
    text: string;
    image: any;
    backgroundColor: string;
}

export const slides: ISlider[] = [
    {
        key: 1,
        title: 'Order Best Food',
        text: 'Search deals on hotels, homes,and much more...',
        image: images.firstStepImage,
        backgroundColor: '#59b2ab',
    },
    {
        key: 2,
        title: 'Find Your Next Stay',
        text: 'Search deals on hotels, homes,and much more...',
        image: images.secondStepImage,
        backgroundColor: '#febe29',
    },
    {
        key: 3,
        title: 'Best Car Hire',
        text: 'Search deals on hotels, homes,and much more...',
        image: images.thirdStepImage,
        backgroundColor: '#22bcb5',
    }
];