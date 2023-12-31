'use client'
import axios from 'axios'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';

import Input from '@/components/Input'
import { useAppSelector } from '@/redux/hooks';

interface signInProps {
    setActiveRoute: Dispatch<SetStateAction<string>>
}
function SignUp({ setActiveRoute }: signInProps) {

    const [loading, setIsLoading] = useState(false)
    const { mode } = useAppSelector((state) => state.user)

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true)
        await axios.post('/api/register', data).then(() => {
            signIn('credentials', { ...data, redirect: false }).then((callback) => {
                if (callback?.error)
                    toast.error("Invalid Credentials")

                if (!callback?.error && callback?.ok) {
                    toast.success("Registration Successfull")
                    setActiveRoute("signIn")
                }
            })
        }).catch((err) => {
            toast.error("User Already Exists")
        }).finally(() => setIsLoading(false))
    }
    return (
        <>
            <h1 className="text-xl font-semibold">Register on Talks Messenger</h1>
            <p className='pb-2.5'>To communicate with your friends and family</p>
            <div className={`flex flex-col items-center rounded-lg py-4 lg:px-12 md:px-10 sm:px-8 px-4 sm:mx-0 mx-2 shadow-lg transition-colors duration-300 ease-in-out ${mode === 'dark' ? 'bg-dark-1' : 'bg-light-1'}`}>
                <h1 className='font-semibold text-2xl'>Sign Up</h1>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                        <Input
                            type={'text'}
                            label={'Enter Your Name'}
                            id={'name'}
                            placeholder='John Deo'
                            required={true}
                            register={register}
                            error={errors}
                            disabled={loading}
                        />
                        <Input
                            type={'email'}
                            label={'Enter Your Email'}
                            id={'email'}
                            placeholder='johndeo@gmail.com'
                            required={true}
                            register={register}
                            error={errors}
                            disabled={loading}
                        />
                        <Input
                            type={'password'}
                            label={'Enter Your Password'}
                            id={'password'}
                            placeholder='password'
                            required={true}
                            register={register}
                            error={errors}
                            disabled={loading}
                        />
                        <button
                            type='submit'
                            className={`w-full bg-transparent border border-white ${mode === 'dark' ? 'text-white' : 'text-black'} mt-4 rounded-full py-2 font-semibold transition-colors duration-150 ease-in-out hover:bg-slate-300 hover:text-[#0d142c] ${loading ? 'cursor-default opacity-50' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Signing...' : 'Sign Up'}</button>
                        <div className='text-center w-full'>
                            <div className={`text-sm ${mode === 'dark' ? 'text-white' : 'text-black'}`}>Already Have a Account?&nbsp;
                                <button
                                    className={`font-semibold text-[#4b5cff] hover:underline ${loading ? 'opacity-60 cursor-default' : ''}`}
                                    onClick={() => setActiveRoute('signIn')}
                                    disabled={loading}
                                >Login</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignUp
