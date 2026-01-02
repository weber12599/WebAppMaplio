import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isDemoMode = ref(false)
    const isInitialized = ref(false)

    function initAuthListener() {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, (currentUser) => {
                if (!isDemoMode.value) {
                    user.value = currentUser
                }
                isInitialized.value = true
                resolve(currentUser)
            })
        })
    }

    async function loginGoogle() {
        try {
            await signInWithPopup(auth, googleProvider)
            isDemoMode.value = false
        } catch (error) {
            console.error('Google Login Error:', error)
            throw error
        }
    }

    function enterDemoMode() {
        isDemoMode.value = true
        user.value = { uid: 'demo-user', displayName: 'Demo Visitor' }
    }

    async function logout() {
        if (isDemoMode.value) {
            isDemoMode.value = false
            user.value = null
            window.location.reload()
        } else {
            await firebaseSignOut(auth)
            window.location.reload()
        }
    }

    return {
        user,
        isDemoMode,
        isInitialized,
        initAuthListener,
        loginGoogle,
        enterDemoMode,
        logout
    }
})
