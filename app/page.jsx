"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import Login from "@/pages/Login/Login";
import { BASE_API, endpoints } from "../constant/endpoints";
import Loader from "@/components/ui/Loaders/Loader";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const lang = Cookies.get("lang") || "AR";
        const token = Cookies.get("token");

        const url = `${BASE_API}${endpoints.user.profile}&lang=${lang}&token=${token}`;
        console.log("Calling profile API:", url);

        const response = await axios.get(url);
        const data = response?.data;
        console.log(response);
        

        if (data) {
          const profile = {
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            contactName: data.contactName,
            contactEmail: data.contactEmail,
            business: data.business,
            contactPhone: data.contactPhone,
            username: data.username,
          };

          Cookies.set("profile", JSON.stringify(profile));
          console.log("Profile fetched successfully. Redirecting to /home...");
          router.push("/home");
        } else {
          console.warn("Profile data missing. Redirecting to /");
          setShowLogin(true);
          router.push("/");
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
        setShowLogin(true);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return <Loader />;

  return showLogin ? <Login /> : null;
}
