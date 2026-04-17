import { useState } from 'react'
import Carousel from '../../components/users/carousel';
import Products from './Products';


export default function Index(){
    return(
        <div>
            <Carousel/>
            <Products/>      
        </div>
    );
}