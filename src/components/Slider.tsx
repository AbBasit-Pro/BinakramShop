import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

// ✅ YOUR LOCAL IMAGES
import kurta1 from "@/assets/men1.jpg";
import kurta2 from "@/assets/cotten-6.jpeg";
import shalwar from "@/assets/women2.jpg";
import eid from "@/assets/sale3.jpg";

const HeroSlider = () => {
  return (
    <section className="relative w-full h-[400px] md:h-[550px] overflow-hidden">

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        speed={1000}
        loop={true}
        className="w-full h-full"
      >

        {/* 🟢 Slide 1 */}
        <SwiperSlide>
          <div className="relative w-full h-full">
            <img
              src={kurta1}
              alt="Kurta Collection"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-lg text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Men Kurta Collection
                  </h1>
                  <p className="text-lg mb-6">
                    Premium cotton & luxury kurta designs.
                  </p>

                  <Link to="/products">
                    <Button size="lg" variant="secondary">
                      Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* 🟢 Slide 2 */}
        <SwiperSlide>
          <div className="relative w-full h-full">
            <img
              src={kurta2}
              alt="Kurta Style"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="container mx-auto px-4 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Modern Kurta Style
                </h1>
                <p className="text-lg mb-6">
                  Traditional wear with modern stitching.
                </p>

                <Link to="/products">
                  <Button size="lg" variant="secondary">
                    Explore Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* 🟢 Slide 3 */}
        <SwiperSlide>
          <div className="relative w-full h-full">
            <img
              src={shalwar}
              alt="Shalwar Kameez"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent flex items-center justify-end">
              <div className="container mx-auto px-4 text-white text-right">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Shalwar Kameez
                </h1>
                <p className="text-lg mb-6">
                  Classic Pakistani traditional wear.
                </p>

                <Link to="/category/men">
                  <Button size="lg" variant="secondary">
                    Shop Collection
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* 🟢 Slide 4 */}
        <SwiperSlide>
          <div className="relative w-full h-full">
            <img
              src={eid}
              alt="Eid Collection"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-green-900/60 flex items-center">
              <div className="container mx-auto px-4 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Eid Special Collection
                </h1>
                <p className="text-lg mb-6">
                  Up to 50% OFF on festive wear.
                </p>

                <Link to="/sale">
                  <Button size="lg" variant="secondary">
                    Shop Sale <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>

      </Swiper>
    </section>
  );
};

export default HeroSlider;