'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import img1 from "../../assets/imgs/auth-bg.svg";
import pattern from "../../assets/imgs/pattern.svg";
import logo from "../../assets/imgs/logo.svg";
import LangSwitcher from '@/components/ui/LangSwitcher';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json"
import ar from "../../../locales/ar.json";
import Loader from '@/components/ui/Loaders/Loader';
import ErrorModal from '@/components/ui/ErrorModal';
import SuccessModal from '@/components/ui/SuccessModal';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { endpoints } from '../../../constant/endpoints';
import { BASE_API } from '../../../constant/endpoints';
import axios from 'axios';

function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalSuccessMessage, setModalSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const translation = state.LANG === "EN" ? en : ar;
  const router = useRouter()

  useEffect(() => {
    setIsLoading(false);
    document.title = state.LANG === 'AR' ? ar.forgetPassword : en.forgetPassword;
  }, []);

  const {
    register,
    handleSubmit,
    reset, 
    formState: { errors },
  } = useForm();

  const onForgetPassword = async (data) => {
    try {
      const username = encodeURIComponent(data.identifier);
      const res = await axios.get(`${BASE_API + endpoints.auth.forgotPassword}&username=${username}&lang=${state.LANG}`)

      if (res.data.error === true) {
        setIsModalOpen(true);
        setModalMessage(state.LANG === "EN" ? res.data.messageEN : res.data.messageAR)
      }else {
        setIsSuccessModalOpen(true)        
        setModalSuccessMessage(res.data.response)
        reset({ identifier: "" });
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="container auth-wrapper">      
    <SuccessModal
      open={isSuccessModalOpen}
      onClose={() => setIsSuccessModalOpen(false)}
      title={translation.success}
      message={modalSuccessMessage}
    />
      <ErrorModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={translation.error}
        message={modalMessage}
      />
      {isLoading && <Loader />}
      <div className="auth-container flex flex-col lg:flex-row gap-4">
        <div className='form-side md:flex-1 flex-12'>
          <div className='image-logo flex-12 block lg:hidden'>
            <Image
              className='pattern-img'
              src={pattern}
              alt="My Image"
            />
            <Image
              className='logo-img'
              src={logo}
              width={252}
              alt="My Image"
            />
          </div>
          <LangSwitcher />
          <h2 className='section-title'>{translation.forgetPassword}</h2>
          <p className='reset-password-form-desc'>{translation.forgetPasswordDesc}</p>

          <form onSubmit={handleSubmit(onForgetPassword)}>
            <div className='form-group'>
              <label className='block mb-2'>{translation.login.username} <span className='required'>*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <i className="icon-sms"></i>
                </div>
                <input
                  className='w-full ps-10 p-2.5'
                  placeholder={translation.login.username}
                  {...register('identifier', {
                    required: translation.login.errors.username.required,
                    pattern: {
                      value: /^(?!.*[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF])[\w@.\- ]+$/,
                      message: translation.login.errors.username.invalid,
                    },
                  })}
                  onInput={e => {
                    // Remove Arabic letters as user types
                    e.target.value = e.target.value.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g, '');
                  }}
                />
              </div>
              {errors.identifier && <span className="error-msg text-red-500">{errors.identifier.message}</span>}
            </div>

            <button className='primary-btn w-full' type="submit">{translation.send}</button>
          </form>

          <div className='form-blow'>
            <Link className='ms-1' href="/">{translation.backLogin}</Link>
          </div>
        </div>
        <div className='image-side md:flex-1 flex-12 hidden lg:block'>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={img1}
              alt="My Image"
              fill
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
