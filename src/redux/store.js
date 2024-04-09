import { configureStore } from '@reduxjs/toolkit'
import Article from './article'
/* ConfigureStore permet de créer le store
Plus simplement contrairement aux versions
Précédentes de Redux.

Cette méthode reçoit un objet en paramètre
avec une propriété reducer qui utilise 
automatiquement combinerReducer. 

La fonction configureStore se connecte
automatiquement au Devtools. */

export default configureStore({
    reducer: {
        article: Article
    }
})