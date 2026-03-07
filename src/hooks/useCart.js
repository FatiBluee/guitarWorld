import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"

export const useCart = () => {
    const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEMS = 5
    const MIN_ITEMS = 1

    //Guargar el carrito en el local storage 
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])
    function addToCart (item) {
        const itemExist = cart.findIndex(guitar => guitar.id === item.id)
        if (itemExist >= 0) { //Existe en el carrito
            if (cart[itemExist].quantity >= MAX_ITEMS) return 
            const updatedCart = [...cart]
            updatedCart[itemExist].quantity++
            setCart(updatedCart)
        } else {
            item.quantity = 1
            setCart([...cart, item])
        }
    }

    function removeCart (id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity (id) {
        const updatedCart = cart.map( item => {
            if(item.id === id && item.quantity < MAX_ITEMS){
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updatedCart)
    } 

    function decreaseQuantity (id) {
        const updatedCart = cart.map (item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item 
        })
        setCart(updatedCart)
    }

    function clearCart() {
        setCart([])
    }

    //Funciones que se usan en Header
    //State derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart]) //. Solo vuelve a recalcular el valor si una de sus dependencias cambia, evitando así cálculos innecesarios en cada renderizado del componente. 
    const cartTotal = useMemo (() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

    return {
        data, 
        cart,
        addToCart,
        removeCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}