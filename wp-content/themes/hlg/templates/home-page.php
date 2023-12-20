<?php 
/**
 * Template Name: Home Page
*/
get_header();
while ( have_posts() ) : the_post();
?>
<!-- SITE CONTENT -->
<main class="site-content site-content--home">
      <!-- HERO SECTION -->
      <section class="hero-section relative bg-[#f2fefe]">
        <div class="swiper hero-swiper">
          <div class="swiper-wrapper -lg:pb-12">
            <div class="swiper-slide">
              <div class="py-[14rem] bg-light bg-center bg-cover bg-no-repeat -2xl:py-[11rem] -lg:py-[7rem] -md:py-24" style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/hero-banner-1.jpg)">
                <div class="container">
                  <div class="-md:bg-white -md:bg-opacity-50 -md:p-5">
                    <div class="content-box w-[60%] mb-9 -lg:w-[65%] -md:w-full -md:text-center -md:mb-7">
                      <h2>Home of the REAL Alkaline</h2>
                      <h1>
                        lonized White W.o.If.Water!<br />
                        Water of Life! <sup>TM</sup>
                      </h1>
                      <h3>NO Chemicals! NO Additives! Delivered FRESH To Your Door!</h3>
                    </div>
                    <div class="-md:text-center">
                      <a href="#" class="btn btn-primary">Order Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="py-[14rem] bg-light bg-center bg-cover bg-no-repeat -2xl:py-[11rem] -lg:py-[7rem] -md:py-24" style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/hero-banner-1.jpg)">
                <div class="container">
                  <div class="-md:bg-white -md:bg-opacity-50 -md:p-5">
                    <div class="content-box w-[60%] mb-9 -lg:w-[65%] -md:w-full -md:text-center -md:mb-7">
                      <h2>Home of the REAL Alkaline</h2>
                      <h1>
                        lonized White W.o.If.Water!<br />
                        Water of Life! <sup>TM</sup>
                      </h1>
                      <h3>NO Chemicals! NO Additives! Delivered FRESH To Your Door!</h3>
                    </div>
                    <div class="-md:text-center">
                      <a href="#" class="btn btn-primary">Order Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="swiper-pagination"></div>

          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </section>

      <!-- TOP PRODUCTS VIEW SECTION -->
      <section class="top-products-view-section pt-[6.625rem] pb-[9.25rem] bg-center bg-cover bg-no-repeat -3xl:pt-[5.625rem] -3xl:pb-[8.25rem] -xl:pt-[4.625rem] -xl:pb-[7.25rem] -lg:pb-[5.25rem] -md:pt-10 -md:pb-8" style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/top-products-section-bg.png)">
        <div class="container">
          <div class="grid grid-cols-12 gap-x-7 items-center -2xl:gap-x-6 -xl:gap-x-0 -xl:gap-y-8">
            <div class="col-span-3 -xl:col-span-12 -xl:text-center">
              <div class="content-box text-2xl font-heading mb-[2.375rem] -xl:px-[16%] -lg:px-[8%] -md:px-0 -md:text-xl -md:mb-6">
                <h2>Want fresh filtered water without the hassle?</h2>
                <p>Bottled water delivery is a convenient alternative to filtration systems and single-serve water bottles.</p>
              </div>

              <div>
                <div class="swiper-button-prev--top-products inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] rounded-full border border-[#d8dede] text-dark hover:bg-primary hover:text-white hover:border-primary mr-4"><i class="fa-solid fa-arrow-left-long"></i></div>
                <div class="swiper-button-next--top-products inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] rounded-full border border-[#d8dede] text-dark hover:bg-primary hover:text-white hover:border-primary"><i class="fa-solid fa-arrow-right-long"></i></div>
              </div>
            </div>
            <div class="col-span-9 -xl:col-span-12">
              <div class="-mx-3">
                <div class="swiper products-swiper">
                  <div class="swiper-wrapper -lg:pb-12">
                    <div class="swiper-slide p-3">
                      <div class="product-card bg-white p-3 rounded-[0.875rem] shadow-[0_10px_9px_rgba(0,0,0,0.06)]">
                        <div class="relative">
                          <figure class="border border-[#f2f2f2] rounded-[0.875rem] overflow-hidden">
                            <a href="#" title="HLG Vedica 1 Litre Water Bottles">
                              <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" />
                            </a>
                          </figure>

                          <span class="bg-primary font-heading rounded-[3.75rem] leading-[1] text-white absolute top-3 left-1 text-sm px-5 py-1">5 Litre, 1 Bottle</span>
                        </div>

                        <div class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">
                          <span class="text-[#b9b9b9] font-bold text-lg mr-2">$10.00</span>
                          <span class="text-2xl font-bold text-[#f00000]">$10.00</span>
                        </div>

                        <div class="text-center mb-7">
                          <h6 class="text-lg text-primary font-normal">HLG Vedica 1 Litre Water Bottles</h6>
                          <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
                        </div>

                        <div class="flex items-center">
                          <a href="#" class="btn btn-primary w-full btn--order">Order Now</a>
                          <a href="#" class="flex-shrink-0 bg-primary rounded-full inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] ml-3" title="Add To Wishlist">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/wishlist-heart-icon.png" alt="" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="swiper-slide p-3">
                      <div class="product-card bg-white p-3 rounded-[0.875rem] shadow-[0_10px_9px_rgba(0,0,0,0.06)]">
                        <div class="relative">
                          <figure class="border border-[#f2f2f2] rounded-[0.875rem] overflow-hidden">
                            <a href="#" title="HLG Vedica 1 Litre Water Bottles">
                              <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" />
                            </a>
                          </figure>

                          <span class="bg-primary font-heading rounded-[3.75rem] leading-[1] text-white absolute top-3 left-1 text-sm px-5 py-1">5 Litre, 1 Bottle</span>
                        </div>

                        <div class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">
                          <span class="text-[#b9b9b9] font-bold text-lg mr-2">$10.00</span>
                          <span class="text-2xl font-bold text-[#f00000]">$10.00</span>
                        </div>

                        <div class="text-center mb-7">
                          <h6 class="text-lg text-primary font-normal">HLG Vedica 1 Litre Water Bottles</h6>
                          <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
                        </div>

                        <div class="flex items-center">
                          <a href="#" class="btn btn-primary w-full btn--order">Order Now</a>
                          <a href="#" class="flex-shrink-0 bg-primary rounded-full inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] ml-3" title="Add To Wishlist">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/wishlist-heart-icon.png" alt="" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="swiper-slide p-3">
                      <div class="product-card bg-white p-3 rounded-[0.875rem] shadow-[0_10px_9px_rgba(0,0,0,0.06)]">
                        <div class="relative">
                          <figure class="border border-[#f2f2f2] rounded-[0.875rem] overflow-hidden">
                            <a href="#" title="HLG Vedica 1 Litre Water Bottles">
                              <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" />
                            </a>
                          </figure>

                          <span class="bg-primary font-heading rounded-[3.75rem] leading-[1] text-white absolute top-3 left-1 text-sm px-5 py-1">5 Litre, 1 Bottle</span>
                        </div>

                        <div class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">
                          <span class="text-[#b9b9b9] font-bold text-lg mr-2">$10.00</span>
                          <span class="text-2xl font-bold text-[#f00000]">$10.00</span>
                        </div>

                        <div class="text-center mb-7">
                          <h6 class="text-lg text-primary font-normal">HLG Vedica 1 Litre Water Bottles</h6>
                          <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
                        </div>

                        <div class="flex items-center">
                          <a href="#" class="btn btn-primary w-full btn--order">Order Now</a>
                          <a href="#" class="flex-shrink-0 bg-primary rounded-full inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] ml-3" title="Add To Wishlist">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/wishlist-heart-icon.png" alt="" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="swiper-slide p-3">
                      <div class="product-card bg-white p-3 rounded-[0.875rem] shadow-[0_10px_9px_rgba(0,0,0,0.06)]">
                        <div class="relative">
                          <figure class="border border-[#f2f2f2] rounded-[0.875rem] overflow-hidden">
                            <a href="#" title="HLG Vedica 1 Litre Water Bottles">
                              <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" />
                            </a>
                          </figure>

                          <span class="bg-primary font-heading rounded-[3.75rem] leading-[1] text-white absolute top-3 left-1 text-sm px-5 py-1">5 Litre, 1 Bottle</span>
                        </div>

                        <div class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">
                          <span class="text-[#b9b9b9] font-bold text-lg mr-2">$10.00</span>
                          <span class="text-2xl font-bold text-[#f00000]">$10.00</span>
                        </div>

                        <div class="text-center mb-7">
                          <h6 class="text-lg text-primary font-normal">HLG Vedica 1 Litre Water Bottles</h6>
                          <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
                        </div>

                        <div class="flex items-center">
                          <a href="#" class="btn btn-primary w-full btn--order">Order Now</a>
                          <a href="#" class="flex-shrink-0 bg-primary rounded-full inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] ml-3" title="Add To Wishlist">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/wishlist-heart-icon.png" alt="" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="swiper-pagination"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- LOGO TEXT BLOCK SECTION -->
      <section class="adv-section pb-16 -md:pb-[3.75rem]">
        <div class="container">
          <div class="inner-wrap relative rounded-2xl bg-center bg-cover bg-no-repeat px-[5.625rem] py-[4.1875rem] -3xl:px-[4.625rem] -2xl:px-[3.625rem] -lg:px-10 -lg:py-[3.25rem] -md:px-5" style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/ad-section-bg.jpg)">
            <div class="relative w-1/2 -lg:w-[60%] -md:w-full -md:text-center">
              <div class="content-box mb-6">
                <h2>More than 250,000 families choose us for their homes</h2>
                <p>When it comes to providing pure water for your family, nothing but the best will be done.</p>
              </div>

              <ul class="inline-flex items-center gap-x-[3.125rem] -2xl:gap-x-10 -lg:gap-x-8 -md:gap-x-4">
                <li>
                  <img src="<?php echo get_template_directory_uri();?>/assets/images/highly-recommended-homelifegoods-allignable.png" alt="" />
                </li>

                <li>
                  <img src="<?php echo get_template_directory_uri();?>/assets/images/bbb-rated-business_orig.png" alt="" />
                </li>

                <li>
                  <img src="<?php echo get_template_directory_uri();?>/assets/images/homelifegoods-express-shipping-pic_8.png" alt="" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div class="bg-center bg-cover bg-no-repeat" style="background-image: url(assets/images/Shape\ 6.png)">
        <!-- Featured Products Section -->
        <section class="featured-products-section pb-[3.25rem]">
          <div class="container">
            <div class="tabs-nav bg-[#efefef] rounded-[1.625rem] flex justify-center mb-9 -md:mb-6">
              <ul class="inline-flex -md:overflow-x-auto">
                <li class="active"><a href="#tab1" class="py-5 px-10 rounded-[3.75rem] font-heading text-lg capitalize inline-block whitespace-nowrap -md:py-4 -md:px-8">All</a></li>
                <li><a href="#tab2" class="py-5 px-10 rounded-[3.75rem] font-heading text-lg capitalize inline-block whitespace-nowrap -md:py-4 -md:px-8">Alkalizng Ionizing Machine</a></li>
                <li><a href="#tab3" class="py-5 px-10 rounded-[3.75rem] font-heading text-lg capitalize inline-block whitespace-nowrap -md:py-4 -md:px-8">HlG Flters</a></li>
                <li><a href="#tab4" class="py-5 px-10 rounded-[3.75rem] font-heading text-lg capitalize inline-block whitespace-nowrap -md:py-4 -md:px-8">Alkaline Sticks</a></li>
              </ul>
            </div>

            <div class="tabs-content">
              <div id="tab1">
                <div class="-mx-3">
                  <div class="swiper products-swiper-main">
                    <div class="swiper-wrapper pb-12">
                      <div class="swiper-slide p-3">
                        <div class="product-card bg-white p-3 rounded-[0.875rem] shadow-[0_10px_9px_rgba(0,0,0,0.06)]">
                          <div class="relative">
                            <figure class="border border-[#f2f2f2] rounded-[0.875rem] overflow-hidden">
                              <a href="#" title="HLG Vedica 1 Litre Water Bottles">
                                <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" />
                              </a>
                            </figure>

                            <span class="bg-primary font-heading rounded-[3.75rem] leading-[1] text-white absolute top-3 left-1 text-sm px-5 py-1">5 Litre, 1 Bottle</span>
                          </div>

                          <div class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">
                            <span class="text-[#b9b9b9] font-bold text-lg mr-2">$10.00</span>
                            <span class="text-2xl font-bold text-[#f00000]">$10.00</span>
                          </div>

                          <div class="text-center mb-7">
                            <h6 class="text-lg text-primary font-normal">HLG Vedica 1 Litre Water Bottles</h6>
                            <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
                          </div>

                          <div class="flex items-center">
                            <a href="#" class="btn btn-primary w-full btn--order">Order Now</a>
                            <a href="#" class="flex-shrink-0 bg-primary rounded-full inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] ml-3" title="Add To Wishlist">
                              <img src="<?php echo get_template_directory_uri();?>/assets/images/wishlist-heart-icon.png" alt="" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div class="swiper-slide p-3">
                        <div class="product-card bg-white p-3 rounded-[0.875rem] shadow-[0_10px_9px_rgba(0,0,0,0.06)]">
                          <div class="relative">
                            <figure class="border border-[#f2f2f2] rounded-[0.875rem] overflow-hidden">
                              <a href="#" title="HLG Vedica 1 Litre Water Bottles">
                                <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" />
                              </a>
                            </figure>

                            <span class="bg-primary font-heading rounded-[3.75rem] leading-[1] text-white absolute top-3 left-1 text-sm px-5 py-1">5 Litre, 1 Bottle</span>
                          </div>

                          <div class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">
                            <span class="text-[#b9b9b9] font-bold text-lg mr-2">$10.00</span>
                            <span class="text-2xl font-bold text-[#f00000]">$10.00</span>
                          </div>

                          <div class="text-center mb-7">
                            <h6 class="text-lg text-primary font-normal">HLG Vedica 1 Litre Water Bottles</h6>
                            <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
                          </div>

                          <div class="flex items-center">
                            <a href="#" class="btn btn-primary w-full btn--order">Order Now</a>
                            <a href="#" class="flex-shrink-0 bg-primary rounded-full inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] ml-3" title="Add To Wishlist">
                              <img src="<?php echo get_template_directory_uri();?>/assets/images/wishlist-heart-icon.png" alt="" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div class="swiper-slide p-3">
                        <div class="product-card bg-white p-3 rounded-[0.875rem] shadow-[0_10px_9px_rgba(0,0,0,0.06)]">
                          <div class="relative">
                            <figure class="border border-[#f2f2f2] rounded-[0.875rem] overflow-hidden">
                              <a href="#" title="HLG Vedica 1 Litre Water Bottles">
                                <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" />
                              </a>
                            </figure>

                            <span class="bg-primary font-heading rounded-[3.75rem] leading-[1] text-white absolute top-3 left-1 text-sm px-5 py-1">5 Litre, 1 Bottle</span>
                          </div>

                          <div class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">
                            <span class="text-[#b9b9b9] font-bold text-lg mr-2">$10.00</span>
                            <span class="text-2xl font-bold text-[#f00000]">$10.00</span>
                          </div>

                          <div class="text-center mb-7">
                            <h6 class="text-lg text-primary font-normal">HLG Vedica 1 Litre Water Bottles</h6>
                            <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
                          </div>

                          <div class="flex items-center">
                            <a href="#" class="btn btn-primary w-full btn--order">Order Now</a>
                            <a href="#" class="flex-shrink-0 bg-primary rounded-full inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] ml-3" title="Add To Wishlist">
                              <img src="<?php echo get_template_directory_uri();?>/assets/images/wishlist-heart-icon.png" alt="" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div class="swiper-slide p-3">
                        <div class="product-card bg-white p-3 rounded-[0.875rem] shadow-[0_10px_9px_rgba(0,0,0,0.06)]">
                          <div class="relative">
                            <figure class="border border-[#f2f2f2] rounded-[0.875rem] overflow-hidden">
                              <a href="#" title="HLG Vedica 1 Litre Water Bottles">
                                <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" />
                              </a>
                            </figure>

                            <span class="bg-primary font-heading rounded-[3.75rem] leading-[1] text-white absolute top-3 left-1 text-sm px-5 py-1">5 Litre, 1 Bottle</span>
                          </div>

                          <div class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">
                            <span class="text-[#b9b9b9] font-bold text-lg mr-2">$10.00</span>
                            <span class="text-2xl font-bold text-[#f00000]">$10.00</span>
                          </div>

                          <div class="text-center mb-7">
                            <h6 class="text-lg text-primary font-normal">HLG Vedica 1 Litre Water Bottles</h6>
                            <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</p>
                          </div>

                          <div class="flex items-center">
                            <a href="#" class="btn btn-primary w-full btn--order">Order Now</a>
                            <a href="#" class="flex-shrink-0 bg-primary rounded-full inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] ml-3" title="Add To Wishlist">
                              <img src="<?php echo get_template_directory_uri();?>/assets/images/wishlist-heart-icon.png" alt="" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="swiper-pagination"></div>
                  </div>
                </div>
              </div>

              <div id="tab2">
                <h3>Second Tab</h3>
                <p>We don't have anything but happy trees here. See. We take the corner of the brush and let it play back-and-forth. You can work and carry-on and put lots of little happy things in here. Without washing the brush, I'm gonna go right into some Van Dyke Brown, some Burnt Umber, and a little bit of Sap Green. This is a fantastic little painting. The first step to doing anything is to believe you can do it. See it finished in your mind before you ever start.</p>
              </div>

              <div id="tab3">
                <h3>Third Tab</h3>
                <p>Isn't that fantastic? You can just push a little tree out of your brush like that. Happy painting, God bless. You better get your coat out, this is going to be a cold painting. And right there you got an almighty cloud. A fan brush can be your best friend. Look at them little rascals.</p>
              </div>

              <div id="tab4">
                <h3>Fourth Tab</h3>
                <p>Just go out and talk to a tree. Make friends with it. For the lack of a better word I call them hangy downs. There's nothing wrong with having a tree as a friend. Maybe there's a happy little waterfall happening over here. I think there's an artist hidden in the bottom of every single one of us. So often we avoid running water, and running water is a lot of fun.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- TESTIMONIAL SECTION -->
        <section class="testimonial-section pb-[4.125rem] overflow-x-hidden -md:pb-[3.75rem]">
          <div class="container">
            <div class="pb-9 border-b border-[#e4e4e4]">
              <div class="grid grid-cols-12 gap-x-6 items-center -md:gap-x-0">
                <div class="col-span-8 -md:col-span-12">
                  <div class="content-box top-content-box -md:text-center">
                    <h2>What Client Says About Us</h2>
                  </div>
                </div>
                <div class="col-span-4 flex justify-end -md:col-span-12 -md:hidden">
                  <div class="swiper-button-prev--custom inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] rounded-full border border-[#d8dede] text-dark hover:bg-primary hover:text-white hover:border-primary mr-4"><i class="fa-solid fa-arrow-left-long"></i></div>
                  <div class="swiper-button-next--custom inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] rounded-full border border-[#d8dede] text-dark hover:bg-primary hover:text-white hover:border-primary"><i class="fa-solid fa-arrow-right-long"></i></div>
                </div>
              </div>
            </div>
          </div>

          <div class="carousel-wrap mt-[3.125rem] -mx-[14.125rem] -xl:mt-10 -md:-mx-[12rem] -sm:-mx-0 -sm:px-2 -md:mt-8">
            <div class="swiper testimonial-swiper">
              <div class="swiper-wrapper pt-12 pb-12 -md:pb-10">
                <div class="swiper-slide py-6 px-2">
                  <div class="testimonial-card relative">
                    <div class="testimonial-card__inner-wrap bg-white rounded-xl shadow-[1px_6px_21px_rgba(0,0,0,0.05)] pl-6 pt-[2.625rem] pb-8 pr-9 z-10">
                      <div class="flex justify-end">
                        <img src="<?php echo get_template_directory_uri();?>/assets/images/quote-icon.png" alt="" />
                      </div>

                      <div class="text-[#ffba00]">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                      </div>

                      <div class="content-box my-9 -md:my-7">
                        <p>My busy schedule leaves little, if any, time for blogging and social media. The Lorem Ipsum Company has been a huge part of helping me grow my business through organic search and content marketing</p>
                      </div>

                      <div>
                        <h4 class="mb-0 leading-[1] text-dark">Sagar Rajak</h4>
                      </div>

                      <figure class="absolute left-9 -top-14 w-[7rem] h-[7rem] inline-flex items-center justify-center rounded-full overflow-hidden border-4 border-primary z-10">
                        <img src="<?php echo get_template_directory_uri();?>/assets/images/testimonia-client.jpg" alt="" class="w-full h-full object-cover" />
                      </figure>
                    </div>

                    <span class="w-[8.25rem] h-[8.25rem] bg-primary rounded-full block absolute left-[1.5625rem] -top-[4.125rem] z-[5]">&nbsp;</span>
                  </div>
                </div>

                <div class="swiper-slide py-6 px-2">
                  <div class="testimonial-card relative">
                    <div class="testimonial-card__inner-wrap bg-white rounded-xl shadow-[1px_6px_21px_rgba(0,0,0,0.05)] pl-6 pt-[2.625rem] pb-8 pr-9 z-10">
                      <div class="flex justify-end">
                        <img src="<?php echo get_template_directory_uri();?>/assets/images/quote-icon.png" alt="" />
                      </div>

                      <div class="text-[#ffba00]">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                      </div>

                      <div class="content-box my-9 -md:my-7">
                        <p>My busy schedule leaves little, if any, time for blogging and social media. The Lorem Ipsum Company has been a huge part of helping me grow my business through organic search and content marketing</p>
                      </div>

                      <div>
                        <h4 class="mb-0 leading-[1] text-dark">Sagar Rajak</h4>
                      </div>

                      <figure class="absolute left-9 -top-14 w-[7rem] h-[7rem] inline-flex items-center justify-center rounded-full overflow-hidden border-4 border-primary z-10">
                        <img src="<?php echo get_template_directory_uri();?>/assets/images/testimonia-client.jpg" alt="" class="w-full h-full object-cover" />
                      </figure>
                    </div>

                    <span class="w-[8.25rem] h-[8.25rem] bg-primary rounded-full block absolute left-[1.5625rem] -top-[4.125rem] z-[5]">&nbsp;</span>
                  </div>
                </div>

                <div class="swiper-slide py-6 px-2">
                  <div class="testimonial-card relative">
                    <div class="testimonial-card__inner-wrap bg-white rounded-xl shadow-[1px_6px_21px_rgba(0,0,0,0.05)] pl-6 pt-[2.625rem] pb-8 pr-9 z-10">
                      <div class="flex justify-end">
                        <img src="<?php echo get_template_directory_uri();?>/assets/images/quote-icon.png" alt="" />
                      </div>

                      <div class="text-[#ffba00]">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                      </div>

                      <div class="content-box my-9 -md:my-7">
                        <p>My busy schedule leaves little, if any, time for blogging and social media. The Lorem Ipsum Company has been a huge part of helping me grow my business through organic search and content marketing</p>
                      </div>

                      <div>
                        <h4 class="mb-0 leading-[1] text-dark">Sagar Rajak</h4>
                      </div>

                      <figure class="absolute left-9 -top-14 w-[7rem] h-[7rem] inline-flex items-center justify-center rounded-full overflow-hidden border-4 border-primary z-10">
                        <img src="<?php echo get_template_directory_uri();?>/assets/images/testimonia-client.jpg" alt="" class="w-full h-full object-cover" />
                      </figure>
                    </div>

                    <span class="w-[8.25rem] h-[8.25rem] bg-primary rounded-full block absolute left-[1.5625rem] -top-[4.125rem] z-[5]">&nbsp;</span>
                  </div>
                </div>

                <div class="swiper-slide py-6 px-2">
                  <div class="testimonial-card relative">
                    <div class="testimonial-card__inner-wrap bg-white rounded-xl shadow-[1px_6px_21px_rgba(0,0,0,0.05)] pl-6 pt-[2.625rem] pb-8 pr-9 z-10">
                      <div class="flex justify-end">
                        <img src="<?php echo get_template_directory_uri();?>/assets/images/quote-icon.png" alt="" />
                      </div>

                      <div class="text-[#ffba00]">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                      </div>

                      <div class="content-box my-9 -md:my-7">
                        <p>My busy schedule leaves little, if any, time for blogging and social media. The Lorem Ipsum Company has been a huge part of helping me grow my business through organic search and content marketing</p>
                      </div>

                      <div>
                        <h4 class="mb-0 leading-[1] text-dark">Sagar Rajak</h4>
                      </div>

                      <figure class="absolute left-9 -top-14 w-[7rem] h-[7rem] inline-flex items-center justify-center rounded-full overflow-hidden border-4 border-primary z-10">
                        <img src="<?php echo get_template_directory_uri();?>/assets/images/testimonia-client.jpg" alt="" class="w-full h-full object-cover" />
                      </figure>
                    </div>

                    <span class="w-[8.25rem] h-[8.25rem] bg-primary rounded-full block absolute left-[1.5625rem] -top-[4.125rem] z-[5]">&nbsp;</span>
                  </div>
                </div>
              </div>

              <div class="swiper-pagination"></div>

              <!-- <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div> -->
            </div>
          </div>
        </section>
      </div>

      <!-- SCHEDULE SECTION -->
      <section class="schedule-section relative py-[6.5rem] -3xl:py-[4.5rem] -2xl:py-16 -3xl:overflow-x-clip">
        <div class="container">
          <div class="grid grid-cols-12 relative z-[10]">
            <div class="col-span-7 pl-9 -2xl:pl-0 -md:col-span-12 -md:text-center">
              <div class="content-box font-heading">
                <h2>Schedule a free in-home water test</h2>
                <p>
                  Once you start Drinking and Cooking with W.o.If.... You'll wonder "How and Why" it took you so long?<br />
                  You'll Be ASTONISHED!
                </p>
              </div>
              <div class="mt-[2.125rem]">
                <a href="#" class="btn btn-primary w-full max-w-[37.625rem]">Test Your Drinking Water Now</a>
              </div>
            </div>
          </div>
        </div>
        <img src="<?php echo get_template_directory_uri();?>/assets/images/tap-call-img.png" alt="" class="absolute bottom-0 right-0 z-[5] -3xl:max-w-[43.75rem] -3xl:-right-[4rem] -2xl:-right-[8rem] -xl:-right-[16rem] -lg:-right-[20rem] -lg:max-w-[42.875rem] -md:hidden">
      </section>

      <!-- WHY CHOOSE US SECTION -->
      <section class="why-choose-us-section pt-20 bg-center bg-cover bg-no-repeat -lg:pt-16 -md:pt-[3.75rem]" style="background-image: url(assets/images/why-choose-us-bg-shape.png)">
        <div class="container">
          <div class="grid grid-cols-12 gap-x-7 items-center -lg:gap-y-10 -lg:gap-x-0">
            <div class="col-span-6 -lg:col-span-12 -lg:text-center">
              <div class="content-box">
                <h5>Why Choose Us</h5>
                <h2>Protect your family with one of the best water filtering system</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo vive rra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum su spendisse ultrices gravida. Risus commodo</p>
              </div>
              <div class="mt-[3.25rem] -2xl:mt-10">
                <a href="#" class="btn btn-primary">More About Us</a>
              </div>
            </div>
            <div class="col-span-6 -lg:col-span-12">
              <div class="grid grid-cols-2 gap-7 -xl:gap-6 -md:grid-cols-1">
                <div class="why-us-card rounded-[0.8125rem] bg-white shadow-[0px_5px_9px_rgba(0,0,0,0.08)] text-center px-6 py-[3.625rem] -3xl:py-10 -2xl:px-5">
                  <figure class="mb-6 inline-block">
                    <img src="<?php echo get_template_directory_uri();?>/assets/images/test-tube (1).png" alt="" />
                  </figure>
                  <div class="content-box">
                    <h3>Effectiveness</h3>
                    <p>Our filter removes 99% of lead and asbestos and 62 other harmful contaminants.</p>
                  </div>
                </div>

                <div class="why-us-card rounded-[0.8125rem] bg-white shadow-[0px_5px_9px_rgba(0,0,0,0.08)] text-center px-6 py-[3.625rem] -3xl:py-10 -2xl:px-5">
                  <figure class="mb-6 inline-block">
                    <img src="<?php echo get_template_directory_uri();?>/assets/images/test-tube (1).png" alt="" />
                  </figure>
                  <div class="content-box">
                    <h3>Effectiveness</h3>
                    <p>Our filter removes 99% of lead and asbestos and 62 other harmful contaminants.</p>
                  </div>
                </div>

                <div class="why-us-card rounded-[0.8125rem] bg-white shadow-[0px_5px_9px_rgba(0,0,0,0.08)] text-center px-6 py-[3.625rem] -3xl:py-10 -2xl:px-5">
                  <figure class="mb-6 inline-block">
                    <img src="<?php echo get_template_directory_uri();?>/assets/images/test-tube (1).png" alt="" />
                  </figure>
                  <div class="content-box">
                    <h3>Effectiveness</h3>
                    <p>Our filter removes 99% of lead and asbestos and 62 other harmful contaminants.</p>
                  </div>
                </div>

                <div class="why-us-card rounded-[0.8125rem] bg-white shadow-[0px_5px_9px_rgba(0,0,0,0.08)] text-center px-6 py-[3.625rem] -3xl:py-10 -2xl:px-5">
                  <figure class="mb-6 inline-block">
                    <img src="<?php echo get_template_directory_uri();?>/assets/images/test-tube (1).png" alt="" />
                  </figure>
                  <div class="content-box">
                    <h3>Effectiveness</h3>
                    <p>Our filter removes 99% of lead and asbestos and 62 other harmful contaminants.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA BLOCK SECTION -->
      <section class="home-cta-block-section pt-20 pb-16 -md:pt-[3.75rem]">
        <div class="container">
          <div class="bg-primary rounded-[0.9375rem] text-center py-16 px-5">
            <div class="content-box">
              <h2>Want More Information?</h2>
              <h3>Call Us: <a href="mailto:(123) 456-78-90">(123) 456-78-90</a></h3>
            </div>
            <div class="mx-auto max-w-[27.5rem]">
              <a href="#" class="btn btn-white w-full">More About Us</a>
            </div>
          </div>
        </div>
      </section>

      <!-- BECOME A WHITE WOLF SECTION -->
      <section class="become-a-white-wolf-section">
        <div class="container">
          <div class="grid grid-cols-12 items-center -lg:gap-y-10">
            <div class="col-span-6 -lg:col-span-12">
              <div class="pr-10 pl-[8.33%] -xl:pl-0">
                <img src="<?php echo get_template_directory_uri();?>/assets/images/wolf-logo.png" alt="" width="125" height="125" />

                <div class="content-box mt-8 mb-10 -xl:mb-8">
                  <h2>Benefit Your Community</h2>
                  <p>Produce W.o.lf Locally! from ytour Home or Business !</p>
                </div>

                <div class="contact-info-wrap inline-flex items-center">
                  <figure class="flex-shrink-0 w-[3.75rem] h-[3.75rem] inline-flex items-center justify-center rounded-full border-2 border-[#e4e4e4]">
                    <img src="<?php echo get_template_directory_uri();?>/assets/images/phone-icon.png" alt="" width="26" height="26" />
                  </figure>
                  <div class="ml-[0.9375rem] font-heading">
                    <h4>Quick Contact</h4>
                    <h3><a href="tel:+1-800-500-333-33">+1-800-500-333-33</a></h3>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-span-6 -lg:col-span-12">
              <div class="pt-[3.5rem] pb-[3.375rem] bg-center bg-cover bg-no-repeat rounded-t-xl rounded-r-xl" style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/white-wolf-col-bg.jpg)">
                <div class="ww-wolf-form-wrap max-w-[33.375rem] ml-11 px-[1.375rem] py-[1.875rem] bg-white -2xl:max-w-[30rem] -xl:max-w-[25rem] -lg:max-w-[75%] -lg:mx-auto -md:max-w-full -md:mx-3">
                  <form action="#" class="form white-wolf-form" id="getInTouchForm">
                    <div class="form__field">
                      <input type="text" name="gitf_name" class="form__input" placeholder="Name*" required />
                      <i class="fa-solid fa-user"></i>
                    </div>

                    <div class="form__field">
                      <input type="number" name="gitf_phone" class="form__input" placeholder="Phone*" required />
                      <i class="fa-solid fa-phone"></i>
                    </div>

                    <div class="form__field">
                      <input type="email" name="gitf_email" class="form__input" placeholder="Email*" required />
                      <i class="fa-solid fa-envelope"></i>
                    </div>

                    <div class="form__field">
                      <input type="text" name="gitf_address" class="form__input" placeholder="Address*" required />
                      <i class="fa-solid fa-location-dot"></i>
                    </div>

                    <div class="form__field">
                      <textarea name="gitf_message" class="form__input" placeholder="Message"></textarea>
                      <i class="fa-solid fa-comment"></i>
                    </div>

                    <div class="form__field text-center">
                      <button type="submit" class="btn btn-primary w-full block">Become a White W.O.L.F Warriror</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
<?php
endwhile; // End of the loop.
get_footer();