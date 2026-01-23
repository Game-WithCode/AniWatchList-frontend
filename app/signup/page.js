'use client'
import React from 'react'
import Link from "next/link";
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react";
import { useState,useEffect } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const SignUpPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userRegisted, setuserRegisted] = useState(true)
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()
     useEffect(() => {
   
            if (session?.user?.name) {
          
                // redirect to /user/username
                router.push(`/user/${session.user.name}`);
            }
        }, [session, router]);
    const password = watch('password')
    const onSubmit = async (data) => {
        setuserRegisted(false)

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: data.email,
                username: data.userName,
                password: data.password
            }),
        });

        const result = await res.json();

        // Registration successful, redirect to login page
        if (result) {
            setuserRegisted(true)
        }
        if (res.status === 201) {
            toast.success("Account created successfully!");
        } else if (res.status === 409) {
            toast.warn("⚠️ User already exists!");
        } else if (res.status === 400) {
            toast.error("❌ Please fill all fields!");
        } else {
            toast.error("❌ Something went wrong. Try again!");
        }


    }
    return (
        <>

            <main className="grow w-full max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-0 items-stretch relative">
                <div className="flex-1 relative rounded-b-4xl lg:rounded-b-none lg:rounded-br-4xl lg:rounded-r-4xl overflow-hidden min-h-[300px] lg:min-h-[600px] z-10 transition-all duration-500">
                    <img alt="Anime Cityscape" className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" src="/Images/scenery2.jpg" />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-bgsecondary/10 mix-blend-overlay"></div>

                </div>
                <div className="flex-1 flex flex-col justify-center items-center lg:items-start lg:pl-20 py-4 lg:py-8 relative">
                    <div className="w-full max-w-md">
                        <div className="bg-gray-900/40 backdrop-blur-md border border-bgsecondary/20 p-8 rounded-2xl shadow-[0_0_30px_rgba(44,182,182,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-bgsecondary/10 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="flex bg-black/40 p-1 rounded-full w-full max-w-sm mx-auto mb-10 border border-gray-800">
                                <button className="flex-1 py-2 rounded-full text-sm font-bold text-gray-400 hover:text-white transition-colors" onClick={()=> router.push('/login')}>Login</button>
                                <button className="flex-1 py-2 rounded-full bg-linear-to-r from-gray-800 to-gray-700 text-white text-sm font-bold shadow-lg border border-gray-600">Sign Up</button>
                            </div>
                            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-2">
                                    <label className="block text-gray-300 text-sm font-semibold tracking-wide ml-1" htmlFor='username'>Username</label>
                                    <input className='w-full h-12 px-4 rounded-lg bg-black/40 text-white border border-gray-700 focus:border-bgsecondary focus:ring-1 focus:ring-bgsecondary focus:bg-gray-900/60 focus:outline-none placeholder:text-gray-600 font-medium transition-all duration-300' {...register("userName", { required: { value: true, message: "This field is Required" }, minLength: { value: 4, message: "Min Length 4" }, maxLength: { value: 10, message: "Max Character is 10" } })} type='text' id='username' placeholder='Enter your UserName' />
                                    {errors.userName && <p className='text-red-500 text-sm mt-1'>{errors.userName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-gray-300 text-sm font-semibold tracking-wide ml-1" htmlFor='email'>Email</label>
                                    <input className='w-full h-12 px-4 rounded-lg bg-black/40 text-white border border-gray-700 focus:border-bgsecondary focus:ring-1 focus:ring-bgsecondary focus:bg-gray-900/60 focus:outline-none placeholder:text-gray-600 font-medium transition-all duration-300'   {...register('email', {
                                        required: 'Email is required', // required validation
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // email regex
                                            message: 'Please enter a valid email'
                                        }
                                    })}
                                        type='email' id='email' placeholder='Enter your Email' />
                                    {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className='block text-gray-300 text-sm font-semibold tracking-wide ml-1' htmlFor='password'>Password</label>
                                    <input className='w-full h-12 px-4 rounded-lg bg-black/40 text-white border border-gray-700 focus:border-bgsecondary focus:ring-1 focus:ring-bgsecondary focus:bg-gray-900/60 focus:outline-none placeholder:text-gray-600 font-medium transition-all duration-300' placeholder="••••••••" {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    })}
                                        type='password' id='password' />
                                    {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    
                                    <label className="block text-gray-300 text-sm font-semibold tracking-wide ml-1" htmlFor='cPAssword'>Comfirm password</label>
                                    <input className='w-full h-12 px-4 rounded-lg bg-black/40 text-white border border-gray-700 focus:border-bgsecondary focus:ring-1 focus:ring-bgsecondary focus:bg-gray-900/60 focus:outline-none placeholder:text-gray-600 font-medium transition-all duration-300'  {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (value) => value === password || 'Passwords do not match'
                                    })}
                                        type='password' id='cPAssword' placeholder="••••••••" />
                                    {errors.confirmPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword.message}</p>}
                                </div>
                                <button className="w-full h-12 bg-linear-to-r from-bgsecondary to-teal-600 hover:to-bgsecondary text-white text-lg font-bold rounded-lg transition-all shadow-lg hover:shadow-[0_0_20px_rgba(44,182,182,0.4)] transform hover:-translate-y-0.5 mt-6 border border-transparent" type='submit' disabled={!userRegisted && true}>
                                    Sign Up
                                </button>
                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-transparent text-gray-500 font-bold text-xs uppercase tracking-wider backdrop-blur-xl rounded">OR</span>
                                    </div>
                                </div>
                                <button className="w-full h-12 bg-white/5 backdrop-blur-sm border border-gray-600 text-white font-semibold rounded-lg hover:bg-white hover:text-black hover:border-white transition-all duration-300 flex items-center justify-center gap-3 group" type="button"  onClick={() => signIn("github")}>
                                    <svg className="h-6 w-6 text-white group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                                    </svg>
                                    Sign Up with GitHub
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>


            {/* <div className='mx-auto my-20 w-7xl h-[750px] border rounded-xl shadow-lg bg-black flex'>
                <div className="bg-[url('/Images/signupbg.jpg')] bg-cover bg-center w-1/2 h-full rounded-br-[100px]  rounded-tr-[100px]"></div>
                <div className='w-1/2 px-25'>
                    <div className='flex justify-around items-center  gap-8 mt-15'>
                        <Link href="/login">
                            <button className='bg-[#D9D9D9] px-15 py-2 rounded-full font-bold'>Login</button>
                        </Link>
                        <Link href="/signup">
                            <button className='bg-[#7ADAA5] px-15 py-2 rounded-full font-bold'>Sign In</button>
                        </Link>
                    </div>
                    <div className='mt-20 px-10 '>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='mb-4'>
                                <label className='block text-white mb-2 font-bold' htmlFor='username'>UserName</label>
                                <input className='w-full bg-white px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1AA36]' {...register("userName", { required: { value: true, message: "This field is Required" }, minLength: { value: 4, message: "Min Length 4" }, maxLength: { value: 10, message: "Max Character is 10" } })} type='text' id='username' placeholder='Enter your UserName' />
                                {errors.userName && <p className='text-red-500 text-sm mt-1'>{errors.userName.message}</p>}
                            </div>
                            <div className='mb-4'>
                                <label className='block text-white mb-2 font-bold' htmlFor='email'>Email</label>
                                <input className='w-full bg-white px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1AA36]'   {...register('email', {
                                    required: 'Email is required', // required validation
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // email regex
                                        message: 'Please enter a valid email'
                                    }
                                })}
                                    type='email' id='email' placeholder='Enter your Email' />
                                {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                            </div>
                            <div className='mb-4'>
                                <label className='block text-white mb-2 font-bold' htmlFor='password'>Password</label>
                                <input className='w-full bg-white px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1AA36]'  {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
                                    type='password' id='password' placeholder='Enter your Password' />
                                {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
                            </div>
                            <div className='mb-10'>
                                <label className='block text-white mb-2 font-bold' htmlFor='cPAssword'>Comfirm password</label>
                                <input className='w-full bg-white px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1AA36]'  {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) => value === password || 'Passwords do not match'
                                })}
                                    type='password' id='cPAssword' placeholder='Enter your Comfirm Password' />
                                {errors.confirmPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword.message}</p>}
                            </div>
                            <button className='w-full bg-[#239BA7] text-white font-bold py-2 rounded-lg hover:bg-[#39cfdd] focus:outline-none focus:ring-2 focus:ring-[#E1AA36] focus:ring-offset-2' type='submit' disabled={!userRegisted && true}  >Sign Up</button>
                        </form>
                        <button onClick={() => signIn("github")}>Sign up with GitHub</button>
                    </div>
                </div>
            </div> */}
            {/* <div className='flex justify-center items-center h-screen bg-[#239BA7]'>
                <div className='bg-white p-8 rounded-lg shadow-lg w-96'>
                    <h1 className='text-2xl font-bold mb-6 text-center'>Sign Up</h1>
                    <form>
                        <div className='mb-4'>
                            <label className='block text-gray-700 mb-2' htmlFor='username'>Username</label>
                            <input className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1AA36]' type='text' id='username' placeholder='Enter your username' />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 mb-2' htmlFor='email'>Email</label>
                            <input className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1AA36]' type='email' id='email' placeholder='Enter your email' />
                        </div>
                        <div className='mb-6'>
                            <label className='block text-gray-700 mb-2' htmlFor='password'>Password</label>
                            <input className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1AA36]' type='password' id='password' placeholder='Enter your password' />
                        </div>
                        <button className='w-full bg-[#E1AA36] text-white py-2 rounded-lg hover:bg-[#c1912e] focus:outline-none focus:ring-2 focus:ring-[#E1AA36] focus:ring-offset-2' type='submit'>Sign Up</button>
                    </form>
                </div>
            </div> */}
        </>
    )
}

export default SignUpPage
