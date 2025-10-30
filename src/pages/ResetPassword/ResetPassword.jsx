'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import img1 from "../../assets/imgs/auth-bg.png";
import img2 from "../../assets/imgs/primeReach2.png";
import pattern from "../../assets/imgs/pattern.svg";
import logo from "../../assets/imgs/logo.png";
import LangSwitcher from '@/components/ui/LangSwitcher';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json"
import ar from "../../../locales/ar.json";
import Loader from '@/components/ui/Loaders/Loader';
import SuccessModal from '@/components/ui/SuccessModal';
import ErrorModal from '@/components/ui/ErrorModal';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { endpoints, BASE_API } from '../../../constant/endpoints';
import axios from 'axios';

function ResetPassword() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [corpSuccessMessage, setCorpSuccessMessage] = useState('');
  const [corpErrorMessage, setCorpErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [matchPassword, setMatchPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const translation = state.LANG === "EN" ? en : ar;
  const router = useRouter()
  const siteLocation = Cookies.get("siteLocation")

  useEffect(() => {
    setIsLoading(false);
    document.title = state.LANG === 'AR' ? ar.register.login : en.register.login;
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const inactive = searchParams.get('inActive');

    if (inactive === '1') {
      setModalMessage(translation.resetPassExp);
      setIsModalOpen(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    const lang = Cookies.get("lang") || "AR";
    if (data.password !== data.confirmPassword) {
      setMatchPassword(true);
      return
    }

    try {
      setIsLoading(true);
      const token = location.search.split("resettoken=")[1]; // from URL

      const result = await fetch(
        `${BASE_API + endpoints.auth.resetPassword}&resettoken=${token}&lang=${lang}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pwd: data.password,
          }),
        }
      );

      const res = await result.json();
      setIsLoading(false);
      if (res.error === true) {
        setCorpErrorMessage(lang === "AR" ? res.messageAR : res.messageEN || translation.errorHappened);
        setIsErrorModalOpen(true);
      } else {
        setCorpSuccessMessage(res.response || translation.passwordChangeSuccess);
        setIsSuccessModalOpen(true);
        // Clear the form inputs after success
        reset({
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setCorpErrorMessage(err.response?.data?.response || translation.errorHappened);
      setIsErrorModalOpen(true);
    }
  };

  return (
    <div className="container auth-wrapper">
      <SuccessModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(true)}
        title={translation.success}
        message={corpSuccessMessage}
        goHome={true}
        goHomeTitle={translation.backLogin}
      />

      <ErrorModal
        open={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title={translation.error}
        message={corpErrorMessage}
      />

      <ErrorModal
        open={isModalOpen}
        onClose={() => {
          if (modalMessage !== translation.resetPassExp) {
            setIsModalOpen(false);
          } else {
            setIsModalOpen(true);
          }
        }}
        title={translation.error}
        message={modalMessage}
        hasBtn={modalMessage !== translation.resetPassExp ? false : true}
        hasBtnVal={modalMessage !== translation.resetPassExp ? null : translation.backLogin}
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
          <h2 className='section-title'>{translation.newPassword}</h2>
          <p>{translation.resetPasswordDesc}</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='form-group'>
              <label className='block mb-2'>{translation.newPassword} <span className='required'>*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <i className="icon-shield-security"></i>
                </div>
                <div className="absolute inset-y-0 start-0 flex items-center pe-3.5 password-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <i className="icon-view-on"></i>
                  ) : (
                    <i className="icon-view-off"></i>
                  )}
                </div>
                <input
                  className='w-full ps-10 pe-10 p-2.5'
                  type={`${showPassword ? 'text' : 'password'}`}
                  placeholder={translation.newPassword}
                  {...register('password', {
                    required: translation.login.errors.password.required,
                    minLength: {
                      value: 6,
                      message: translation.login.errors.password.min_length,
                    },
                  })}
                />
              </div>
              {errors.password && <span className="error-msg text-red-500">{errors.password.message}</span>}
            </div>

            <div className='form-group'>
              <label className='block mb-2'>{translation.confirmPassword} <span className='required'>*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <i className="icon-shield-security"></i>
                </div>
                <div className="absolute inset-y-0 start-0 flex items-center pe-3.5 password-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <i className="icon-view-on"></i>
                  ) : (
                    <i className="icon-view-off"></i>
                  )}
                </div>
                <input
                  className='w-full ps-10 pe-10 p-2.5'
                  type={`${showConfirmPassword ? 'text' : 'password'}`}
                  placeholder={translation.confirmPassword}
                  {...register('confirmPassword', {
                    required: translation.login.errors.password.required,
                    validate: value =>
                      value === password || translation.login.errors.password.match,
                  })}
                />
              </div>
              {errors.confirmPassword && <span className="error-msg text-red-500">{errors.confirmPassword.message}</span>}
              {matchPassword && <span className="error-msg text-red-500">{translation.notMatch}</span>}
            </div>

            <button className='primary-btn w-full' type="submit">{translation.resetPassword}</button>
          </form>
        </div>
        <div className='image-side md:flex-1 flex-12 hidden lg:block'>
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
            <img
              src={siteLocation === "primereach" ? img2.src : img1.src}
              alt="My Image"
              className='auth-bg'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
