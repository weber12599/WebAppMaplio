import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

const isOfflineBuild = import.meta.env.VITE_APP_MODE === 'offline'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isDemoMode = ref(isOfflineBuild || localStorage.getItem('maplio_is_demo') === 'true')
    const isAuthReady = ref(false)

    let initPromise = null

    function initAuthListener() {
        if (isOfflineBuild) {
            console.log('maplio-offline build')

            isDemoMode.value = true
            isAuthReady.value = true

            return Promise.resolve(user.value)
        }

        if (isAuthReady.value) {
            return Promise.resolve(user.value)
        }

        if (initPromise) {
            return initPromise
        }

        initPromise = new Promise((resolve) => {
            onAuthStateChanged(auth, (currentUser) => {
                user.value = currentUser

                if (!isAuthReady.value) {
                    isAuthReady.value = true
                    resolve(currentUser)
                }
            })
        })

        return initPromise
    }

    async function loginGoogle() {
        if (isOfflineBuild) return

        try {
            const result = await signInWithPopup(auth, googleProvider)
            user.value = result.user
            isDemoMode.value = false
        } catch (error) {
            console.error('Login failed:', error)
        }
    }

    async function logout() {
        if (isOfflineBuild) return

        await signOut(auth)
        user.value = null
        isDemoMode.value = false
    }

    function enterDemoMode() {
        isDemoMode.value = true
    }

    watch(
        isDemoMode,
        (newVal) => {
            if (newVal) {
                localStorage.setItem('maplio_is_demo', 'true')
                user.value = {
                    uid: 'demo-user',
                    displayName: 'Demo User',
                    email: 'demo@example.com',
                    photoURL: null
                }
            } else {
                localStorage.removeItem('maplio_is_demo')
            }
        },
        { immediate: true }
    )

    return {
        user,
        isDemoMode,
        isAuthReady,
        initAuthListener,
        loginGoogle,
        logout,
        enterDemoMode
    }
})
