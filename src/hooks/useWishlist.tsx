import React, { useEffect, useMemo, useState } from "react";
import { useCreateWishlistMutation, useDeleteFromWishlistMutation } from "../redux/services/wishlist.service";

export const useWishList = ({ initialWishlist, hotelId, type, dishId, cb }: { initialWishlist: boolean, hotelId?: number, type: 'hotel' | 'dish', dishId?: number, cb?: () => Promise<void> }) => {
    const [createWishlist] = useCreateWishlistMutation();
    const [deleteWishlist] = useDeleteFromWishlistMutation();
    const [wishlist, setWishlist] = useState<boolean>(initialWishlist);

    useEffect(() => {
        setWishlist(initialWishlist);
    },[initialWishlist])

    const handleAddToWishlist = async () => {
        if (wishlist) {
            await deleteFromWishlist();
        } else {
            await addToWishlist();
        }
    }

    const addToWishlist = async () => {
        let payload:{hotelId?: number, dishId?: number} = {}
        if (type === 'hotel') {
            payload.hotelId = hotelId;
        } else {
            payload.dishId = dishId;
        }
        try {
            const res = await createWishlist(payload).unwrap();
            setWishlist(true);
            await cb?.();
        } catch (error) {
            console.log('error ===>', error);
            setWishlist(false);
        }
    }

    const deleteFromWishlist = async () => {
        let payload:{id?: number, type?: 'hotel' | 'dish'} = {}
        if (type === 'hotel') {
            payload.id = hotelId;
            payload.type = 'hotel';
        } else {
            payload.id = dishId;
            payload.type = 'dish';
        }
        try {
            const res = await deleteWishlist(payload as { id: number, type: 'hotel' | 'dish' }).unwrap();
            setWishlist(false);
            await cb?.();
        } catch (error) {
            console.log('error ===>', error);
        }
    }

    return {
        wishlist,
        handleAddToWishlist,
        addToWishlist,
        deleteFromWishlist,
    }
}