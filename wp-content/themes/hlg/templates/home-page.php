<?php 
/**
 * Template Name: Home Page
*/
get_header();
while ( have_posts() ) : the_post();
?>
<!-- SITE CONTENT -->
  <main class="site-content site-content--home">
    <!-- Hero Section -->
    <?php if( get_field('banner_image') ): ?>
    <section class="hero-section relative bg-primary bg-center bg-no-repeat bg-cover"
      style="background-image: url(<?php the_field('banner_image'); ?>)">
    <?php endif; ?>
      <div class="container relative pt-14 md:pt-20 xl:pt-24 2xl:pt-36">

        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-12 lg:col-span-6">
            <div class="bg-white bg-opacity-90 px-5 py-8 2xl:px-[3.75rem] 2xl:py-20 rounded-[1.875rem] text-center">
              <?php if( get_field('product_name') ): ?>
              <h4 class="text-dark font-heading text-2xl md:text-3xl xl:text-4xl mb-2"><?php the_field('product_name'); ?></h4>
              <?php endif; ?>
              <?php if( get_field('product_caption_1') ): ?>
              <h1 class="text-primary font-heading uppercase text-5xl md:text-6xl xl:text-7xl 2xl:text-[5rem] mb-2">
                <?php the_field('product_caption_1'); ?></h1>
                <?php endif; ?>
              <?php if( get_field('product_caption_2') ): ?>
              <h4 class="text-dark font-semibold capatizetext-2xl md:text-3xl xl:text-4xl mb-3"><?php the_field('product_caption_2'); ?>
              </h4>
              <?php endif; ?>
              <?php if( get_field('product_caption_3') ): ?>
              <p class="text-dark font-medium xl:text-lg mb-5"><?php the_field('product_caption_3'); ?></p>
              <?php endif; ?>
              <?php if( get_field('product_price') ): ?>
              <h3 class="text-accent text-3xl lg:text-4xl mb-5"><?php the_field('product_price'); ?></h3>
              <?php endif; ?>
              <?php if( get_field('buy_now_link') ): ?>
              <div>
                <a href="<?php the_field('buy_now_link'); ?>" class="btn btn-primary inline-block">Buy Now</a>
              </div>
              <?php endif; ?>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-6">
            <div class="relative text-center mx-8 md:w-1/2 md:mx-auto lg:mx-0 lg:w-full">
              <?php if( get_field('product_image') ): ?>
              <img src="<?php the_field('product_image'); ?>" alt="" class="w-1/2 inline-block lg:w-auto">
              <?php endif; ?>
              <img src="<?php echo get_template_directory_uri();?>/assets/images/hero-water-drop 1-min.png" alt="" class="absolute bottom-0 left-0 right-0">
            </div>
          </div>
        </div>
      </div>

      <img src="<?php echo get_template_directory_uri();?>/assets/images/water2-min.png" alt="" class="absolute bottom-0 left-0 right-0 w-full z-10 rotate-180">
      <img src="<?php echo get_template_directory_uri();?>/assets/images/shape-1.svg" alt="" class="absolute bottom-0 left-0 right-0 w-full z-5 rotate-180">
    </section>

    <!-- WELCOME SECTION -->
    <section class="welcome-section section--py xl:mt-12">
      <div class="container relative lg:py-9">
        <div class="grid grid-cols-12 gap-7 xl:gap-0 items-center relative">
          <?php if( get_field('welcome_left_image') ): ?>
          <div class="col-span-12 xl:col-span-6 text-center">
            <img src="<?php the_field('welcome_left_image'); ?>" alt="Welcome Image" class="inline-block xl:block xl:w-full">
          </div>
          <?php endif; ?>
          <div class="col-span-12 xl:col-span-6 rounded-3xl shadow bg-white">
            <div class="pt-10">
              <h3 class="text-dark font-bold text-3xl 2xl:text-[2.5rem] capitalize mb-4 text-center">Welcome To</h3>
            </div>
            <?php if( get_field('welcome_title') ): ?>
            <h2 class="section__heading text-center text-white font-heading uppercase mb-4 md:mb-6 lg:mb-10 2xl:mb-12 bg-primary py-3"><?php the_field('welcome_title'); ?></h2>
            <?php endif; ?>
            <div class="py-8 px-5 lg:px-12 lg:pb-14 2xl:px-[4.25rem] 2xl: pb-[4.25rem]">
              <?php if( get_field('welcome_content') ): ?>
              <div class="content-box font-medium text-center">
                <?php the_field('welcome_content'); ?>
              </div>
              <?php endif; ?>
              <?php if( get_field('welcome_url') ): ?>
              <p class="text-center mt-8 lg:mt-12"><a href="<?php the_field('welcome_url'); ?>" class="btn btn-primary">Read More</a></p>
              <?php endif; ?>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BEST SELLERS SECTION -->
    <section class="products-section section--py lg:-mt-20 xl:mt-0">
      <div class="container">
        <h2
          class="section__heading text-center text-primary font-heading uppercase mb-10 lg:mb-14 xl:mb-20 2xl:mb-[6.25rem]">
          Bestsellers</h2>

        <div class="swiper swiper--products px-lg-3 pb-4">
          <div class="swiper-wrapper pb-16">
            <!-- Slides -->
            <div class="swiper-slide">
              <div class="product-card relative">
                <div class="product-card__title mb-4">
                  <a href="product-single.html"
                    class="text-dark hover:text-primary font-bold text-sm lg:text-base xl:text-lg line-clamp line-clamp--1"
                    title="400W Power House Gen. + One (1) 50W Panel">400W Power House Gen.
                    + One (1) 50W Panel</a>
                </div>
                <div
                  class="product-card__header border border-borderColor rounded-3xl relative aspect-square group overflow-hidden">

                  <div class="swiper product-card-swiper h-full">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                    </div>
                    <!-- If we need pagination -->
                    <div class="swiper-pagination"></div>

                  </div>
                  <span
                    class="product-card__discount-badge text-xs text-white bg-primary px-2 py-1 rounded-md font-medium">20%
                    OFF</span>
                </div>
                <div class="product-card__body pt-4">
                  <div class="grid grid-cols-12 gap-3 items-center">
                    <div class="product-card__price flex items-center col-span-12 lg:col-span-6">
                      <span
                        class="product-card__sale-price font-bold text-secondary text-base lg:text-lg xl:text-xl 2xl:text-2xl">$59.00</span>
                      <span
                        class="product-card__regular-price font-semibold line-through text-stone-400 ml-2 xl:ml-3 2xl:text-lg">$150.00</span>
                    </div>

                    <div
                      class="product-card__cta-container col-span-12 lg:col-span-6  flex items-center lg:justify-end">
                      <a href="#" class="product-card__btn--cart bg-primary mr-3" title="Add To Cart">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px"
                          height="20px">
                          <path fill-rule="evenodd" fill="rgb(255, 255, 255)"
                            d="M0.632,19.594 C0.402,19.359 0.288,19.081 0.288,18.760 L0.288,5.721 C0.288,5.400 0.402,5.122 0.632,4.887 C0.861,4.653 1.133,4.535 1.447,4.535 L3.765,4.535 C3.789,3.548 4.139,2.708 4.815,2.016 C5.491,1.325 6.300,0.979 7.242,0.979 C8.184,0.979 8.993,1.325 9.669,2.016 C10.345,2.708 10.695,3.548 10.719,4.535 L13.037,4.535 C13.351,4.535 13.623,4.653 13.852,4.887 C14.082,5.122 14.197,5.400 14.197,5.721 L14.197,18.760 C14.197,19.081 14.082,19.359 13.852,19.594 C13.623,19.828 13.351,19.946 13.037,19.946 L1.447,19.946 C1.133,19.946 0.861,19.828 0.632,19.594 ZM1.447,5.721 L1.447,18.760 L13.037,18.760 L13.037,5.721 L1.447,5.721 ZM4.924,4.535 L9.560,4.535 C9.536,3.869 9.301,3.307 8.854,2.850 C8.407,2.393 7.870,2.165 7.242,2.165 C6.614,2.165 6.077,2.393 5.630,2.850 C5.183,3.307 4.948,3.869 4.924,4.535 L4.924,4.535 ZM5.087,7.925 C4.978,7.814 4.924,7.672 4.924,7.499 C4.924,7.326 4.978,7.184 5.087,7.073 C5.196,6.962 5.334,6.906 5.503,6.906 L8.981,6.906 C9.149,6.906 9.289,6.962 9.397,7.073 C9.506,7.184 9.560,7.326 9.560,7.499 C9.560,7.672 9.506,7.814 9.397,7.925 C9.289,8.036 9.149,8.092 8.981,8.092 L5.503,8.092 C5.334,8.092 5.196,8.036 5.087,7.925 Z" />
                        </svg>
                      </a>

                      <a href="#" class="product-card__btn--wishlist bg-primary" title="Add To Wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="29px"
                          height="26px">
                          <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
                            d="M29.396,8.958 L29.396,9.016 L29.396,9.075 C29.396,9.115 29.386,9.173 29.368,9.251 C29.348,9.330 29.339,9.388 29.339,9.427 C29.301,11.029 28.990,12.561 28.405,14.026 C27.819,15.491 27.121,16.761 26.309,17.835 C25.497,18.910 24.534,19.915 23.421,20.852 C22.306,21.790 21.296,22.552 20.390,23.138 C19.484,23.724 18.540,24.260 17.558,24.749 C16.576,25.237 15.916,25.540 15.576,25.657 C15.236,25.774 14.971,25.872 14.783,25.950 C14.593,25.872 14.330,25.764 13.990,25.628 C13.650,25.491 12.999,25.189 12.036,24.720 C11.073,24.251 10.147,23.724 9.260,23.138 C8.373,22.552 7.382,21.781 6.287,20.823 C5.191,19.866 4.238,18.860 3.426,17.805 C2.614,16.751 1.925,15.491 1.359,14.026 C0.793,12.561 0.490,11.029 0.453,9.427 C0.453,9.388 0.443,9.330 0.424,9.251 C0.405,9.173 0.396,9.115 0.396,9.075 L0.396,9.016 C0.396,8.978 0.396,8.939 0.396,8.899 C0.433,6.595 1.255,4.573 2.860,2.835 C4.464,1.097 6.362,0.228 8.552,0.228 C11.120,0.228 13.234,1.380 14.896,3.685 C16.557,1.380 18.672,0.228 21.240,0.228 C23.429,0.228 25.327,1.097 26.932,2.835 C28.537,4.573 29.358,6.595 29.396,8.899 L29.396,8.958 ZM27.584,9.075 C27.584,9.037 27.584,8.997 27.584,8.958 C27.546,7.083 26.904,5.472 25.658,4.124 C24.412,2.776 22.939,2.103 21.240,2.103 C19.276,2.103 17.652,3.002 16.369,4.798 C15.991,5.306 15.500,5.560 14.896,5.560 C14.292,5.560 13.800,5.306 13.423,4.798 C12.139,3.002 10.515,2.103 8.552,2.103 C6.853,2.103 5.380,2.776 4.134,4.124 C2.888,5.472 2.246,7.083 2.209,8.958 C2.209,8.997 2.209,9.037 2.209,9.075 C2.246,9.154 2.265,9.232 2.265,9.310 C2.302,11.029 2.699,12.670 3.455,14.231 C4.210,15.794 5.069,17.083 6.032,18.098 C6.995,19.115 8.118,20.072 9.402,20.970 C10.685,21.869 11.724,22.513 12.517,22.903 C13.310,23.294 14.065,23.646 14.783,23.958 C15.500,23.646 16.264,23.294 17.077,22.903 C17.888,22.513 18.946,21.869 20.249,20.970 C21.551,20.072 22.693,19.115 23.675,18.098 C24.657,17.083 25.535,15.794 26.309,14.231 C27.083,12.670 27.489,11.048 27.527,9.368 C27.527,9.251 27.546,9.154 27.584,9.075 L27.584,9.075 Z"
                            class="fill-white"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="product-card relative">
                <div class="product-card__title mb-4">
                  <a href="product-single.html"
                    class="text-dark hover:text-primary font-bold text-sm lg:text-base xl:text-lg line-clamp line-clamp--1"
                    title="400W Power House Gen. + One (1) 50W Panel">400W Power House Gen.
                    + One (1) 50W Panel</a>
                </div>
                <div
                  class="product-card__header border border-borderColor rounded-3xl relative aspect-square group overflow-hidden">

                  <div class="swiper product-card-swiper h-full">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                    </div>
                    <!-- If we need pagination -->
                    <div class="swiper-pagination"></div>

                  </div>
                  <span
                    class="product-card__discount-badge text-xs text-white bg-primary px-2 py-1 rounded-md font-medium">20%
                    OFF</span>
                </div>
                <div class="product-card__body pt-4">
                  <div class="grid grid-cols-12 gap-3 items-center">
                    <div class="product-card__price flex items-center col-span-12 lg:col-span-6">
                      <span
                        class="product-card__sale-price font-bold text-secondary text-base lg:text-lg xl:text-xl 2xl:text-2xl">$59.00</span>
                      <span
                        class="product-card__regular-price font-semibold line-through text-stone-400 ml-2 xl:ml-3 2xl:text-lg">$150.00</span>
                    </div>

                    <div
                      class="product-card__cta-container col-span-12 lg:col-span-6  flex items-center lg:justify-end">
                      <a href="#" class="product-card__btn--cart bg-primary mr-3" title="Add To Cart">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px"
                          height="20px">
                          <path fill-rule="evenodd" fill="rgb(255, 255, 255)"
                            d="M0.632,19.594 C0.402,19.359 0.288,19.081 0.288,18.760 L0.288,5.721 C0.288,5.400 0.402,5.122 0.632,4.887 C0.861,4.653 1.133,4.535 1.447,4.535 L3.765,4.535 C3.789,3.548 4.139,2.708 4.815,2.016 C5.491,1.325 6.300,0.979 7.242,0.979 C8.184,0.979 8.993,1.325 9.669,2.016 C10.345,2.708 10.695,3.548 10.719,4.535 L13.037,4.535 C13.351,4.535 13.623,4.653 13.852,4.887 C14.082,5.122 14.197,5.400 14.197,5.721 L14.197,18.760 C14.197,19.081 14.082,19.359 13.852,19.594 C13.623,19.828 13.351,19.946 13.037,19.946 L1.447,19.946 C1.133,19.946 0.861,19.828 0.632,19.594 ZM1.447,5.721 L1.447,18.760 L13.037,18.760 L13.037,5.721 L1.447,5.721 ZM4.924,4.535 L9.560,4.535 C9.536,3.869 9.301,3.307 8.854,2.850 C8.407,2.393 7.870,2.165 7.242,2.165 C6.614,2.165 6.077,2.393 5.630,2.850 C5.183,3.307 4.948,3.869 4.924,4.535 L4.924,4.535 ZM5.087,7.925 C4.978,7.814 4.924,7.672 4.924,7.499 C4.924,7.326 4.978,7.184 5.087,7.073 C5.196,6.962 5.334,6.906 5.503,6.906 L8.981,6.906 C9.149,6.906 9.289,6.962 9.397,7.073 C9.506,7.184 9.560,7.326 9.560,7.499 C9.560,7.672 9.506,7.814 9.397,7.925 C9.289,8.036 9.149,8.092 8.981,8.092 L5.503,8.092 C5.334,8.092 5.196,8.036 5.087,7.925 Z" />
                        </svg>
                      </a>

                      <a href="#" class="product-card__btn--wishlist bg-primary" title="Add To Wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="29px"
                          height="26px">
                          <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
                            d="M29.396,8.958 L29.396,9.016 L29.396,9.075 C29.396,9.115 29.386,9.173 29.368,9.251 C29.348,9.330 29.339,9.388 29.339,9.427 C29.301,11.029 28.990,12.561 28.405,14.026 C27.819,15.491 27.121,16.761 26.309,17.835 C25.497,18.910 24.534,19.915 23.421,20.852 C22.306,21.790 21.296,22.552 20.390,23.138 C19.484,23.724 18.540,24.260 17.558,24.749 C16.576,25.237 15.916,25.540 15.576,25.657 C15.236,25.774 14.971,25.872 14.783,25.950 C14.593,25.872 14.330,25.764 13.990,25.628 C13.650,25.491 12.999,25.189 12.036,24.720 C11.073,24.251 10.147,23.724 9.260,23.138 C8.373,22.552 7.382,21.781 6.287,20.823 C5.191,19.866 4.238,18.860 3.426,17.805 C2.614,16.751 1.925,15.491 1.359,14.026 C0.793,12.561 0.490,11.029 0.453,9.427 C0.453,9.388 0.443,9.330 0.424,9.251 C0.405,9.173 0.396,9.115 0.396,9.075 L0.396,9.016 C0.396,8.978 0.396,8.939 0.396,8.899 C0.433,6.595 1.255,4.573 2.860,2.835 C4.464,1.097 6.362,0.228 8.552,0.228 C11.120,0.228 13.234,1.380 14.896,3.685 C16.557,1.380 18.672,0.228 21.240,0.228 C23.429,0.228 25.327,1.097 26.932,2.835 C28.537,4.573 29.358,6.595 29.396,8.899 L29.396,8.958 ZM27.584,9.075 C27.584,9.037 27.584,8.997 27.584,8.958 C27.546,7.083 26.904,5.472 25.658,4.124 C24.412,2.776 22.939,2.103 21.240,2.103 C19.276,2.103 17.652,3.002 16.369,4.798 C15.991,5.306 15.500,5.560 14.896,5.560 C14.292,5.560 13.800,5.306 13.423,4.798 C12.139,3.002 10.515,2.103 8.552,2.103 C6.853,2.103 5.380,2.776 4.134,4.124 C2.888,5.472 2.246,7.083 2.209,8.958 C2.209,8.997 2.209,9.037 2.209,9.075 C2.246,9.154 2.265,9.232 2.265,9.310 C2.302,11.029 2.699,12.670 3.455,14.231 C4.210,15.794 5.069,17.083 6.032,18.098 C6.995,19.115 8.118,20.072 9.402,20.970 C10.685,21.869 11.724,22.513 12.517,22.903 C13.310,23.294 14.065,23.646 14.783,23.958 C15.500,23.646 16.264,23.294 17.077,22.903 C17.888,22.513 18.946,21.869 20.249,20.970 C21.551,20.072 22.693,19.115 23.675,18.098 C24.657,17.083 25.535,15.794 26.309,14.231 C27.083,12.670 27.489,11.048 27.527,9.368 C27.527,9.251 27.546,9.154 27.584,9.075 L27.584,9.075 Z"
                            class="fill-white"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="product-card relative">
                <div class="product-card__title mb-4">
                  <a href="product-single.html"
                    class="text-dark hover:text-primary font-bold text-sm lg:text-base xl:text-lg line-clamp line-clamp--1"
                    title="400W Power House Gen. + One (1) 50W Panel">400W Power House Gen.
                    + One (1) 50W Panel</a>
                </div>
                <div
                  class="product-card__header border border-borderColor rounded-3xl relative aspect-square group overflow-hidden">

                  <div class="swiper product-card-swiper h-full">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                    </div>
                    <!-- If we need pagination -->
                    <div class="swiper-pagination"></div>

                  </div>
                  <span
                    class="product-card__discount-badge text-xs text-white bg-primary px-2 py-1 rounded-md font-medium">20%
                    OFF</span>
                </div>
                <div class="product-card__body pt-4">
                  <div class="grid grid-cols-12 gap-3 items-center">
                    <div class="product-card__price flex items-center col-span-12 lg:col-span-6">
                      <span
                        class="product-card__sale-price font-bold text-secondary text-base lg:text-lg xl:text-xl 2xl:text-2xl">$59.00</span>
                      <span
                        class="product-card__regular-price font-semibold line-through text-stone-400 ml-2 xl:ml-3 2xl:text-lg">$150.00</span>
                    </div>

                    <div
                      class="product-card__cta-container col-span-12 lg:col-span-6  flex items-center lg:justify-end">
                      <a href="#" class="product-card__btn--cart bg-primary mr-3" title="Add To Cart">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px"
                          height="20px">
                          <path fill-rule="evenodd" fill="rgb(255, 255, 255)"
                            d="M0.632,19.594 C0.402,19.359 0.288,19.081 0.288,18.760 L0.288,5.721 C0.288,5.400 0.402,5.122 0.632,4.887 C0.861,4.653 1.133,4.535 1.447,4.535 L3.765,4.535 C3.789,3.548 4.139,2.708 4.815,2.016 C5.491,1.325 6.300,0.979 7.242,0.979 C8.184,0.979 8.993,1.325 9.669,2.016 C10.345,2.708 10.695,3.548 10.719,4.535 L13.037,4.535 C13.351,4.535 13.623,4.653 13.852,4.887 C14.082,5.122 14.197,5.400 14.197,5.721 L14.197,18.760 C14.197,19.081 14.082,19.359 13.852,19.594 C13.623,19.828 13.351,19.946 13.037,19.946 L1.447,19.946 C1.133,19.946 0.861,19.828 0.632,19.594 ZM1.447,5.721 L1.447,18.760 L13.037,18.760 L13.037,5.721 L1.447,5.721 ZM4.924,4.535 L9.560,4.535 C9.536,3.869 9.301,3.307 8.854,2.850 C8.407,2.393 7.870,2.165 7.242,2.165 C6.614,2.165 6.077,2.393 5.630,2.850 C5.183,3.307 4.948,3.869 4.924,4.535 L4.924,4.535 ZM5.087,7.925 C4.978,7.814 4.924,7.672 4.924,7.499 C4.924,7.326 4.978,7.184 5.087,7.073 C5.196,6.962 5.334,6.906 5.503,6.906 L8.981,6.906 C9.149,6.906 9.289,6.962 9.397,7.073 C9.506,7.184 9.560,7.326 9.560,7.499 C9.560,7.672 9.506,7.814 9.397,7.925 C9.289,8.036 9.149,8.092 8.981,8.092 L5.503,8.092 C5.334,8.092 5.196,8.036 5.087,7.925 Z" />
                        </svg>
                      </a>

                      <a href="#" class="product-card__btn--wishlist bg-primary" title="Add To Wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="29px"
                          height="26px">
                          <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
                            d="M29.396,8.958 L29.396,9.016 L29.396,9.075 C29.396,9.115 29.386,9.173 29.368,9.251 C29.348,9.330 29.339,9.388 29.339,9.427 C29.301,11.029 28.990,12.561 28.405,14.026 C27.819,15.491 27.121,16.761 26.309,17.835 C25.497,18.910 24.534,19.915 23.421,20.852 C22.306,21.790 21.296,22.552 20.390,23.138 C19.484,23.724 18.540,24.260 17.558,24.749 C16.576,25.237 15.916,25.540 15.576,25.657 C15.236,25.774 14.971,25.872 14.783,25.950 C14.593,25.872 14.330,25.764 13.990,25.628 C13.650,25.491 12.999,25.189 12.036,24.720 C11.073,24.251 10.147,23.724 9.260,23.138 C8.373,22.552 7.382,21.781 6.287,20.823 C5.191,19.866 4.238,18.860 3.426,17.805 C2.614,16.751 1.925,15.491 1.359,14.026 C0.793,12.561 0.490,11.029 0.453,9.427 C0.453,9.388 0.443,9.330 0.424,9.251 C0.405,9.173 0.396,9.115 0.396,9.075 L0.396,9.016 C0.396,8.978 0.396,8.939 0.396,8.899 C0.433,6.595 1.255,4.573 2.860,2.835 C4.464,1.097 6.362,0.228 8.552,0.228 C11.120,0.228 13.234,1.380 14.896,3.685 C16.557,1.380 18.672,0.228 21.240,0.228 C23.429,0.228 25.327,1.097 26.932,2.835 C28.537,4.573 29.358,6.595 29.396,8.899 L29.396,8.958 ZM27.584,9.075 C27.584,9.037 27.584,8.997 27.584,8.958 C27.546,7.083 26.904,5.472 25.658,4.124 C24.412,2.776 22.939,2.103 21.240,2.103 C19.276,2.103 17.652,3.002 16.369,4.798 C15.991,5.306 15.500,5.560 14.896,5.560 C14.292,5.560 13.800,5.306 13.423,4.798 C12.139,3.002 10.515,2.103 8.552,2.103 C6.853,2.103 5.380,2.776 4.134,4.124 C2.888,5.472 2.246,7.083 2.209,8.958 C2.209,8.997 2.209,9.037 2.209,9.075 C2.246,9.154 2.265,9.232 2.265,9.310 C2.302,11.029 2.699,12.670 3.455,14.231 C4.210,15.794 5.069,17.083 6.032,18.098 C6.995,19.115 8.118,20.072 9.402,20.970 C10.685,21.869 11.724,22.513 12.517,22.903 C13.310,23.294 14.065,23.646 14.783,23.958 C15.500,23.646 16.264,23.294 17.077,22.903 C17.888,22.513 18.946,21.869 20.249,20.970 C21.551,20.072 22.693,19.115 23.675,18.098 C24.657,17.083 25.535,15.794 26.309,14.231 C27.083,12.670 27.489,11.048 27.527,9.368 C27.527,9.251 27.546,9.154 27.584,9.075 L27.584,9.075 Z"
                            class="fill-white"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="product-card relative">
                <div class="product-card__title mb-4">
                  <a href="product-single.html"
                    class="text-dark hover:text-primary font-bold text-sm lg:text-base xl:text-lg line-clamp line-clamp--1"
                    title="400W Power House Gen. + One (1) 50W Panel">400W Power House Gen.
                    + One (1) 50W Panel</a>
                </div>
                <div
                  class="product-card__header border border-borderColor rounded-3xl relative aspect-square group overflow-hidden">

                  <div class="swiper product-card-swiper h-full">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                    </div>
                    <!-- If we need pagination -->
                    <div class="swiper-pagination"></div>

                  </div>
                  <span
                    class="product-card__discount-badge text-xs text-white bg-primary px-2 py-1 rounded-md font-medium">20%
                    OFF</span>
                </div>
                <div class="product-card__body pt-4">
                  <div class="grid grid-cols-12 gap-3 items-center">
                    <div class="product-card__price flex items-center col-span-12 lg:col-span-6">
                      <span
                        class="product-card__sale-price font-bold text-secondary text-base lg:text-lg xl:text-xl 2xl:text-2xl">$59.00</span>
                      <span
                        class="product-card__regular-price font-semibold line-through text-stone-400 ml-2 xl:ml-3 2xl:text-lg">$150.00</span>
                    </div>

                    <div
                      class="product-card__cta-container col-span-12 lg:col-span-6  flex items-center lg:justify-end">
                      <a href="#" class="product-card__btn--cart bg-primary mr-3" title="Add To Cart">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px"
                          height="20px">
                          <path fill-rule="evenodd" fill="rgb(255, 255, 255)"
                            d="M0.632,19.594 C0.402,19.359 0.288,19.081 0.288,18.760 L0.288,5.721 C0.288,5.400 0.402,5.122 0.632,4.887 C0.861,4.653 1.133,4.535 1.447,4.535 L3.765,4.535 C3.789,3.548 4.139,2.708 4.815,2.016 C5.491,1.325 6.300,0.979 7.242,0.979 C8.184,0.979 8.993,1.325 9.669,2.016 C10.345,2.708 10.695,3.548 10.719,4.535 L13.037,4.535 C13.351,4.535 13.623,4.653 13.852,4.887 C14.082,5.122 14.197,5.400 14.197,5.721 L14.197,18.760 C14.197,19.081 14.082,19.359 13.852,19.594 C13.623,19.828 13.351,19.946 13.037,19.946 L1.447,19.946 C1.133,19.946 0.861,19.828 0.632,19.594 ZM1.447,5.721 L1.447,18.760 L13.037,18.760 L13.037,5.721 L1.447,5.721 ZM4.924,4.535 L9.560,4.535 C9.536,3.869 9.301,3.307 8.854,2.850 C8.407,2.393 7.870,2.165 7.242,2.165 C6.614,2.165 6.077,2.393 5.630,2.850 C5.183,3.307 4.948,3.869 4.924,4.535 L4.924,4.535 ZM5.087,7.925 C4.978,7.814 4.924,7.672 4.924,7.499 C4.924,7.326 4.978,7.184 5.087,7.073 C5.196,6.962 5.334,6.906 5.503,6.906 L8.981,6.906 C9.149,6.906 9.289,6.962 9.397,7.073 C9.506,7.184 9.560,7.326 9.560,7.499 C9.560,7.672 9.506,7.814 9.397,7.925 C9.289,8.036 9.149,8.092 8.981,8.092 L5.503,8.092 C5.334,8.092 5.196,8.036 5.087,7.925 Z" />
                        </svg>
                      </a>

                      <a href="#" class="product-card__btn--wishlist bg-primary" title="Add To Wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="29px"
                          height="26px">
                          <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
                            d="M29.396,8.958 L29.396,9.016 L29.396,9.075 C29.396,9.115 29.386,9.173 29.368,9.251 C29.348,9.330 29.339,9.388 29.339,9.427 C29.301,11.029 28.990,12.561 28.405,14.026 C27.819,15.491 27.121,16.761 26.309,17.835 C25.497,18.910 24.534,19.915 23.421,20.852 C22.306,21.790 21.296,22.552 20.390,23.138 C19.484,23.724 18.540,24.260 17.558,24.749 C16.576,25.237 15.916,25.540 15.576,25.657 C15.236,25.774 14.971,25.872 14.783,25.950 C14.593,25.872 14.330,25.764 13.990,25.628 C13.650,25.491 12.999,25.189 12.036,24.720 C11.073,24.251 10.147,23.724 9.260,23.138 C8.373,22.552 7.382,21.781 6.287,20.823 C5.191,19.866 4.238,18.860 3.426,17.805 C2.614,16.751 1.925,15.491 1.359,14.026 C0.793,12.561 0.490,11.029 0.453,9.427 C0.453,9.388 0.443,9.330 0.424,9.251 C0.405,9.173 0.396,9.115 0.396,9.075 L0.396,9.016 C0.396,8.978 0.396,8.939 0.396,8.899 C0.433,6.595 1.255,4.573 2.860,2.835 C4.464,1.097 6.362,0.228 8.552,0.228 C11.120,0.228 13.234,1.380 14.896,3.685 C16.557,1.380 18.672,0.228 21.240,0.228 C23.429,0.228 25.327,1.097 26.932,2.835 C28.537,4.573 29.358,6.595 29.396,8.899 L29.396,8.958 ZM27.584,9.075 C27.584,9.037 27.584,8.997 27.584,8.958 C27.546,7.083 26.904,5.472 25.658,4.124 C24.412,2.776 22.939,2.103 21.240,2.103 C19.276,2.103 17.652,3.002 16.369,4.798 C15.991,5.306 15.500,5.560 14.896,5.560 C14.292,5.560 13.800,5.306 13.423,4.798 C12.139,3.002 10.515,2.103 8.552,2.103 C6.853,2.103 5.380,2.776 4.134,4.124 C2.888,5.472 2.246,7.083 2.209,8.958 C2.209,8.997 2.209,9.037 2.209,9.075 C2.246,9.154 2.265,9.232 2.265,9.310 C2.302,11.029 2.699,12.670 3.455,14.231 C4.210,15.794 5.069,17.083 6.032,18.098 C6.995,19.115 8.118,20.072 9.402,20.970 C10.685,21.869 11.724,22.513 12.517,22.903 C13.310,23.294 14.065,23.646 14.783,23.958 C15.500,23.646 16.264,23.294 17.077,22.903 C17.888,22.513 18.946,21.869 20.249,20.970 C21.551,20.072 22.693,19.115 23.675,18.098 C24.657,17.083 25.535,15.794 26.309,14.231 C27.083,12.670 27.489,11.048 27.527,9.368 C27.527,9.251 27.546,9.154 27.584,9.075 L27.584,9.075 Z"
                            class="fill-white"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div> -->

          <div class="swiper-pagination"></div>
        </div>
      </div>
    </section>

    <!-- CATEGORY SECTION -->
    <section
      class="categories-section relative section--pb bg-light bg-center bg-cover bg-no-repeat pt-[7.5rem] sm:pt-[12rem] lg:pt-[18rem] xl:pt-[22rem] 2xl:pt-[32rem]"
      style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/hero-banner.jpg)">
      <div class="container relative">
        <ul class="grid categories-grid gap-3 lg:gap-4 xl:gap-6 2xl:gap-8">
          <li>
            <h2 class="section__heading text-center text-dark font-heading uppercase mb-10 lg:text-left">
              Shop By Category</h2>
          </li>

          <li>
            <div class="category-block relative rounded-3xl overflow-hidden group h-full">
              <div class="category-block__header overflow-hidden aspect-[3/4] lg:aspect-auto lg:h-full">
                <a href="#" class="w-full h-full">
                  <img src="<?php echo get_template_directory_uri();?>/assets/images/category-item-1.jpg" alt=""
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
                </a>
              </div>
              <div class="category-block__body bg-primary text-center lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
                <a href="#"
                  class="text-white uppercase block font-bold text-sm lg:text-base 2xl:text-lg py-5 px-2">Alkaline Water
                  Ionizers</a>
              </div>
            </div>
          </li>

          <li>
            <div class="category-block relative rounded-3xl overflow-hidden group h-full">
              <div class="category-block__header overflow-hidden aspect-[3/4] lg:aspect-auto lg:h-full">
                <a href="#" class="w-full h-full">
                  <img src="<?php echo get_template_directory_uri();?>/assets/images/category-item-1.jpg" alt=""
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
                </a>
              </div>
              <div class="category-block__body bg-primary text-center lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
                <a href="#"
                  class="text-white uppercase block font-bold text-sm lg:text-base 2xl:text-lg py-5 px-2">Alkaline Water
                  Ionizers</a>
              </div>
            </div>
          </li>

          <li>
            <div class="category-block relative rounded-3xl overflow-hidden group h-full">
              <div class="category-block__header overflow-hidden aspect-[3/4] lg:aspect-auto lg:h-full">
                <a href="#" class="w-full h-full">
                  <img src="<?php echo get_template_directory_uri();?>/assets/images/category-item-1.jpg" alt=""
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
                </a>
              </div>
              <div class="category-block__body bg-primary text-center lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
                <a href="#"
                  class="text-white uppercase block font-bold text-sm lg:text-base 2xl:text-lg py-5 px-2">Alkaline Water
                  Ionizers</a>
              </div>
            </div>
          </li>

          <li>
            <div class="category-block relative rounded-3xl overflow-hidden group h-full">
              <div class="category-block__header overflow-hidden aspect-[3/4] lg:aspect-auto lg:h-full">
                <a href="#" class="w-full h-full">
                  <img src="<?php echo get_template_directory_uri();?>/assets/images/category-item-1.jpg" alt=""
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
                </a>
              </div>
              <div class="category-block__body bg-primary text-center lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
                <a href="#"
                  class="text-white uppercase block font-bold text-sm lg:text-base 2xl:text-lg py-5 px-2">Alkaline Water
                  Ionizers</a>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <img src="<?php echo get_template_directory_uri();?>/assets/images/water2-min.png" alt="" class="absolute top-0 left-0 right-0 w-full z-10">
      <img src="<?php echo get_template_directory_uri();?>/assets/images/shape-1.svg" alt="" class="absolute top-0 left-0 right-0 w-full z-5">
    </section>

    <!-- VIDEO SECTION -->
    <section class="video-section">
      <div class="video-container">
        <video controls id="video1">
          <source src="<?php echo get_template_directory_uri();?>/assets/images/dummy-video.mp4" type="video/mp4">
        </video>

        <button
          class="video__btn--play w-16 h-16 lg:w-24 lg:h-24 rounded-full inline-flex items-center justify-center bg-primary border-4 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-7 lg:w-10">
            <path
              d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
              class="fill-white" />
          </svg>
        </button>

        <div class="video__thumbnail bg-primary bg-center bg-cover bg-no-repeat"
          style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/video-thumbnail.jpg)" id="videoPlayBtn">
        </div>
      </div>
    </section>

    <!-- FEATURED COLLECTION SECTION -->
    <section class="products-section section--py">
      <div class="container">
        <h2
          class="section__heading text-center text-primary font-heading uppercase mb-10 lg:mb-14 xl:mb-20 2xl:mb-[6.25rem]">
          Featured
          Collection</h2>

        <div class="swiper swiper--products px-lg-3 pb-4">
          <div class="swiper-wrapper pb-16">
            <!-- Slides -->
            <div class="swiper-slide">
              <div class="product-card relative">
                <div class="product-card__title mb-4">
                  <a href="product-single.html"
                    class="text-dark hover:text-primary font-bold text-sm lg:text-base xl:text-lg line-clamp line-clamp--1"
                    title="400W Power House Gen. + One (1) 50W Panel">400W Power House Gen.
                    + One (1) 50W Panel</a>
                </div>
                <div
                  class="product-card__header border border-borderColor rounded-3xl relative aspect-square group overflow-hidden">

                  <div class="swiper product-card-swiper h-full">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                    </div>
                    <!-- If we need pagination -->
                    <div class="swiper-pagination"></div>

                  </div>
                  <span
                    class="product-card__discount-badge text-xs text-white bg-primary px-2 py-1 rounded-md font-medium">20%
                    OFF</span>
                </div>
                <div class="product-card__body pt-4">
                  <div class="grid grid-cols-12 gap-3 items-center">
                    <div class="product-card__price flex items-center col-span-12 lg:col-span-6">
                      <span
                        class="product-card__sale-price font-bold text-secondary text-base lg:text-lg xl:text-xl 2xl:text-2xl">$59.00</span>
                      <span
                        class="product-card__regular-price font-semibold line-through text-stone-400 ml-2 xl:ml-3 2xl:text-lg">$150.00</span>
                    </div>

                    <div
                      class="product-card__cta-container col-span-12 lg:col-span-6  flex items-center lg:justify-end">
                      <a href="#" class="product-card__btn--cart bg-primary mr-3" title="Add To Cart">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px"
                          height="20px">
                          <path fill-rule="evenodd" fill="rgb(255, 255, 255)"
                            d="M0.632,19.594 C0.402,19.359 0.288,19.081 0.288,18.760 L0.288,5.721 C0.288,5.400 0.402,5.122 0.632,4.887 C0.861,4.653 1.133,4.535 1.447,4.535 L3.765,4.535 C3.789,3.548 4.139,2.708 4.815,2.016 C5.491,1.325 6.300,0.979 7.242,0.979 C8.184,0.979 8.993,1.325 9.669,2.016 C10.345,2.708 10.695,3.548 10.719,4.535 L13.037,4.535 C13.351,4.535 13.623,4.653 13.852,4.887 C14.082,5.122 14.197,5.400 14.197,5.721 L14.197,18.760 C14.197,19.081 14.082,19.359 13.852,19.594 C13.623,19.828 13.351,19.946 13.037,19.946 L1.447,19.946 C1.133,19.946 0.861,19.828 0.632,19.594 ZM1.447,5.721 L1.447,18.760 L13.037,18.760 L13.037,5.721 L1.447,5.721 ZM4.924,4.535 L9.560,4.535 C9.536,3.869 9.301,3.307 8.854,2.850 C8.407,2.393 7.870,2.165 7.242,2.165 C6.614,2.165 6.077,2.393 5.630,2.850 C5.183,3.307 4.948,3.869 4.924,4.535 L4.924,4.535 ZM5.087,7.925 C4.978,7.814 4.924,7.672 4.924,7.499 C4.924,7.326 4.978,7.184 5.087,7.073 C5.196,6.962 5.334,6.906 5.503,6.906 L8.981,6.906 C9.149,6.906 9.289,6.962 9.397,7.073 C9.506,7.184 9.560,7.326 9.560,7.499 C9.560,7.672 9.506,7.814 9.397,7.925 C9.289,8.036 9.149,8.092 8.981,8.092 L5.503,8.092 C5.334,8.092 5.196,8.036 5.087,7.925 Z" />
                        </svg>
                      </a>

                      <a href="#" class="product-card__btn--wishlist bg-primary" title="Add To Wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="29px"
                          height="26px">
                          <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
                            d="M29.396,8.958 L29.396,9.016 L29.396,9.075 C29.396,9.115 29.386,9.173 29.368,9.251 C29.348,9.330 29.339,9.388 29.339,9.427 C29.301,11.029 28.990,12.561 28.405,14.026 C27.819,15.491 27.121,16.761 26.309,17.835 C25.497,18.910 24.534,19.915 23.421,20.852 C22.306,21.790 21.296,22.552 20.390,23.138 C19.484,23.724 18.540,24.260 17.558,24.749 C16.576,25.237 15.916,25.540 15.576,25.657 C15.236,25.774 14.971,25.872 14.783,25.950 C14.593,25.872 14.330,25.764 13.990,25.628 C13.650,25.491 12.999,25.189 12.036,24.720 C11.073,24.251 10.147,23.724 9.260,23.138 C8.373,22.552 7.382,21.781 6.287,20.823 C5.191,19.866 4.238,18.860 3.426,17.805 C2.614,16.751 1.925,15.491 1.359,14.026 C0.793,12.561 0.490,11.029 0.453,9.427 C0.453,9.388 0.443,9.330 0.424,9.251 C0.405,9.173 0.396,9.115 0.396,9.075 L0.396,9.016 C0.396,8.978 0.396,8.939 0.396,8.899 C0.433,6.595 1.255,4.573 2.860,2.835 C4.464,1.097 6.362,0.228 8.552,0.228 C11.120,0.228 13.234,1.380 14.896,3.685 C16.557,1.380 18.672,0.228 21.240,0.228 C23.429,0.228 25.327,1.097 26.932,2.835 C28.537,4.573 29.358,6.595 29.396,8.899 L29.396,8.958 ZM27.584,9.075 C27.584,9.037 27.584,8.997 27.584,8.958 C27.546,7.083 26.904,5.472 25.658,4.124 C24.412,2.776 22.939,2.103 21.240,2.103 C19.276,2.103 17.652,3.002 16.369,4.798 C15.991,5.306 15.500,5.560 14.896,5.560 C14.292,5.560 13.800,5.306 13.423,4.798 C12.139,3.002 10.515,2.103 8.552,2.103 C6.853,2.103 5.380,2.776 4.134,4.124 C2.888,5.472 2.246,7.083 2.209,8.958 C2.209,8.997 2.209,9.037 2.209,9.075 C2.246,9.154 2.265,9.232 2.265,9.310 C2.302,11.029 2.699,12.670 3.455,14.231 C4.210,15.794 5.069,17.083 6.032,18.098 C6.995,19.115 8.118,20.072 9.402,20.970 C10.685,21.869 11.724,22.513 12.517,22.903 C13.310,23.294 14.065,23.646 14.783,23.958 C15.500,23.646 16.264,23.294 17.077,22.903 C17.888,22.513 18.946,21.869 20.249,20.970 C21.551,20.072 22.693,19.115 23.675,18.098 C24.657,17.083 25.535,15.794 26.309,14.231 C27.083,12.670 27.489,11.048 27.527,9.368 C27.527,9.251 27.546,9.154 27.584,9.075 L27.584,9.075 Z"
                            class="fill-white"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="product-card relative">
                <div class="product-card__title mb-4">
                  <a href="product-single.html"
                    class="text-dark hover:text-primary font-bold text-sm lg:text-base xl:text-lg line-clamp line-clamp--1"
                    title="400W Power House Gen. + One (1) 50W Panel">400W Power House Gen.
                    + One (1) 50W Panel</a>
                </div>
                <div
                  class="product-card__header border border-borderColor rounded-3xl relative aspect-square group overflow-hidden">

                  <div class="swiper product-card-swiper h-full">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                    </div>
                    <!-- If we need pagination -->
                    <div class="swiper-pagination"></div>

                  </div>
                  <span
                    class="product-card__discount-badge text-xs text-white bg-primary px-2 py-1 rounded-md font-medium">20%
                    OFF</span>
                </div>
                <div class="product-card__body pt-4">
                  <div class="grid grid-cols-12 gap-3 items-center">
                    <div class="product-card__price flex items-center col-span-12 lg:col-span-6">
                      <span
                        class="product-card__sale-price font-bold text-secondary text-base lg:text-lg xl:text-xl 2xl:text-2xl">$59.00</span>
                      <span
                        class="product-card__regular-price font-semibold line-through text-stone-400 ml-2 xl:ml-3 2xl:text-lg">$150.00</span>
                    </div>

                    <div
                      class="product-card__cta-container col-span-12 lg:col-span-6  flex items-center lg:justify-end">
                      <a href="#" class="product-card__btn--cart bg-primary mr-3" title="Add To Cart">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px"
                          height="20px">
                          <path fill-rule="evenodd" fill="rgb(255, 255, 255)"
                            d="M0.632,19.594 C0.402,19.359 0.288,19.081 0.288,18.760 L0.288,5.721 C0.288,5.400 0.402,5.122 0.632,4.887 C0.861,4.653 1.133,4.535 1.447,4.535 L3.765,4.535 C3.789,3.548 4.139,2.708 4.815,2.016 C5.491,1.325 6.300,0.979 7.242,0.979 C8.184,0.979 8.993,1.325 9.669,2.016 C10.345,2.708 10.695,3.548 10.719,4.535 L13.037,4.535 C13.351,4.535 13.623,4.653 13.852,4.887 C14.082,5.122 14.197,5.400 14.197,5.721 L14.197,18.760 C14.197,19.081 14.082,19.359 13.852,19.594 C13.623,19.828 13.351,19.946 13.037,19.946 L1.447,19.946 C1.133,19.946 0.861,19.828 0.632,19.594 ZM1.447,5.721 L1.447,18.760 L13.037,18.760 L13.037,5.721 L1.447,5.721 ZM4.924,4.535 L9.560,4.535 C9.536,3.869 9.301,3.307 8.854,2.850 C8.407,2.393 7.870,2.165 7.242,2.165 C6.614,2.165 6.077,2.393 5.630,2.850 C5.183,3.307 4.948,3.869 4.924,4.535 L4.924,4.535 ZM5.087,7.925 C4.978,7.814 4.924,7.672 4.924,7.499 C4.924,7.326 4.978,7.184 5.087,7.073 C5.196,6.962 5.334,6.906 5.503,6.906 L8.981,6.906 C9.149,6.906 9.289,6.962 9.397,7.073 C9.506,7.184 9.560,7.326 9.560,7.499 C9.560,7.672 9.506,7.814 9.397,7.925 C9.289,8.036 9.149,8.092 8.981,8.092 L5.503,8.092 C5.334,8.092 5.196,8.036 5.087,7.925 Z" />
                        </svg>
                      </a>

                      <a href="#" class="product-card__btn--wishlist bg-primary" title="Add To Wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="29px"
                          height="26px">
                          <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
                            d="M29.396,8.958 L29.396,9.016 L29.396,9.075 C29.396,9.115 29.386,9.173 29.368,9.251 C29.348,9.330 29.339,9.388 29.339,9.427 C29.301,11.029 28.990,12.561 28.405,14.026 C27.819,15.491 27.121,16.761 26.309,17.835 C25.497,18.910 24.534,19.915 23.421,20.852 C22.306,21.790 21.296,22.552 20.390,23.138 C19.484,23.724 18.540,24.260 17.558,24.749 C16.576,25.237 15.916,25.540 15.576,25.657 C15.236,25.774 14.971,25.872 14.783,25.950 C14.593,25.872 14.330,25.764 13.990,25.628 C13.650,25.491 12.999,25.189 12.036,24.720 C11.073,24.251 10.147,23.724 9.260,23.138 C8.373,22.552 7.382,21.781 6.287,20.823 C5.191,19.866 4.238,18.860 3.426,17.805 C2.614,16.751 1.925,15.491 1.359,14.026 C0.793,12.561 0.490,11.029 0.453,9.427 C0.453,9.388 0.443,9.330 0.424,9.251 C0.405,9.173 0.396,9.115 0.396,9.075 L0.396,9.016 C0.396,8.978 0.396,8.939 0.396,8.899 C0.433,6.595 1.255,4.573 2.860,2.835 C4.464,1.097 6.362,0.228 8.552,0.228 C11.120,0.228 13.234,1.380 14.896,3.685 C16.557,1.380 18.672,0.228 21.240,0.228 C23.429,0.228 25.327,1.097 26.932,2.835 C28.537,4.573 29.358,6.595 29.396,8.899 L29.396,8.958 ZM27.584,9.075 C27.584,9.037 27.584,8.997 27.584,8.958 C27.546,7.083 26.904,5.472 25.658,4.124 C24.412,2.776 22.939,2.103 21.240,2.103 C19.276,2.103 17.652,3.002 16.369,4.798 C15.991,5.306 15.500,5.560 14.896,5.560 C14.292,5.560 13.800,5.306 13.423,4.798 C12.139,3.002 10.515,2.103 8.552,2.103 C6.853,2.103 5.380,2.776 4.134,4.124 C2.888,5.472 2.246,7.083 2.209,8.958 C2.209,8.997 2.209,9.037 2.209,9.075 C2.246,9.154 2.265,9.232 2.265,9.310 C2.302,11.029 2.699,12.670 3.455,14.231 C4.210,15.794 5.069,17.083 6.032,18.098 C6.995,19.115 8.118,20.072 9.402,20.970 C10.685,21.869 11.724,22.513 12.517,22.903 C13.310,23.294 14.065,23.646 14.783,23.958 C15.500,23.646 16.264,23.294 17.077,22.903 C17.888,22.513 18.946,21.869 20.249,20.970 C21.551,20.072 22.693,19.115 23.675,18.098 C24.657,17.083 25.535,15.794 26.309,14.231 C27.083,12.670 27.489,11.048 27.527,9.368 C27.527,9.251 27.546,9.154 27.584,9.075 L27.584,9.075 Z"
                            class="fill-white"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="product-card relative">
                <div class="product-card__title mb-4">
                  <a href="product-single.html"
                    class="text-dark hover:text-primary font-bold text-sm lg:text-base xl:text-lg line-clamp line-clamp--1"
                    title="400W Power House Gen. + One (1) 50W Panel">400W Power House Gen.
                    + One (1) 50W Panel</a>
                </div>
                <div
                  class="product-card__header border border-borderColor rounded-3xl relative aspect-square group overflow-hidden">

                  <div class="swiper product-card-swiper h-full">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                    </div>
                    <!-- If we need pagination -->
                    <div class="swiper-pagination"></div>

                  </div>
                  <span
                    class="product-card__discount-badge text-xs text-white bg-primary px-2 py-1 rounded-md font-medium">20%
                    OFF</span>
                </div>
                <div class="product-card__body pt-4">
                  <div class="grid grid-cols-12 gap-3 items-center">
                    <div class="product-card__price flex items-center col-span-12 lg:col-span-6">
                      <span
                        class="product-card__sale-price font-bold text-secondary text-base lg:text-lg xl:text-xl 2xl:text-2xl">$59.00</span>
                      <span
                        class="product-card__regular-price font-semibold line-through text-stone-400 ml-2 xl:ml-3 2xl:text-lg">$150.00</span>
                    </div>

                    <div
                      class="product-card__cta-container col-span-12 lg:col-span-6  flex items-center lg:justify-end">
                      <a href="#" class="product-card__btn--cart bg-primary mr-3" title="Add To Cart">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px"
                          height="20px">
                          <path fill-rule="evenodd" fill="rgb(255, 255, 255)"
                            d="M0.632,19.594 C0.402,19.359 0.288,19.081 0.288,18.760 L0.288,5.721 C0.288,5.400 0.402,5.122 0.632,4.887 C0.861,4.653 1.133,4.535 1.447,4.535 L3.765,4.535 C3.789,3.548 4.139,2.708 4.815,2.016 C5.491,1.325 6.300,0.979 7.242,0.979 C8.184,0.979 8.993,1.325 9.669,2.016 C10.345,2.708 10.695,3.548 10.719,4.535 L13.037,4.535 C13.351,4.535 13.623,4.653 13.852,4.887 C14.082,5.122 14.197,5.400 14.197,5.721 L14.197,18.760 C14.197,19.081 14.082,19.359 13.852,19.594 C13.623,19.828 13.351,19.946 13.037,19.946 L1.447,19.946 C1.133,19.946 0.861,19.828 0.632,19.594 ZM1.447,5.721 L1.447,18.760 L13.037,18.760 L13.037,5.721 L1.447,5.721 ZM4.924,4.535 L9.560,4.535 C9.536,3.869 9.301,3.307 8.854,2.850 C8.407,2.393 7.870,2.165 7.242,2.165 C6.614,2.165 6.077,2.393 5.630,2.850 C5.183,3.307 4.948,3.869 4.924,4.535 L4.924,4.535 ZM5.087,7.925 C4.978,7.814 4.924,7.672 4.924,7.499 C4.924,7.326 4.978,7.184 5.087,7.073 C5.196,6.962 5.334,6.906 5.503,6.906 L8.981,6.906 C9.149,6.906 9.289,6.962 9.397,7.073 C9.506,7.184 9.560,7.326 9.560,7.499 C9.560,7.672 9.506,7.814 9.397,7.925 C9.289,8.036 9.149,8.092 8.981,8.092 L5.503,8.092 C5.334,8.092 5.196,8.036 5.087,7.925 Z" />
                        </svg>
                      </a>

                      <a href="#" class="product-card__btn--wishlist bg-primary" title="Add To Wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="29px"
                          height="26px">
                          <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
                            d="M29.396,8.958 L29.396,9.016 L29.396,9.075 C29.396,9.115 29.386,9.173 29.368,9.251 C29.348,9.330 29.339,9.388 29.339,9.427 C29.301,11.029 28.990,12.561 28.405,14.026 C27.819,15.491 27.121,16.761 26.309,17.835 C25.497,18.910 24.534,19.915 23.421,20.852 C22.306,21.790 21.296,22.552 20.390,23.138 C19.484,23.724 18.540,24.260 17.558,24.749 C16.576,25.237 15.916,25.540 15.576,25.657 C15.236,25.774 14.971,25.872 14.783,25.950 C14.593,25.872 14.330,25.764 13.990,25.628 C13.650,25.491 12.999,25.189 12.036,24.720 C11.073,24.251 10.147,23.724 9.260,23.138 C8.373,22.552 7.382,21.781 6.287,20.823 C5.191,19.866 4.238,18.860 3.426,17.805 C2.614,16.751 1.925,15.491 1.359,14.026 C0.793,12.561 0.490,11.029 0.453,9.427 C0.453,9.388 0.443,9.330 0.424,9.251 C0.405,9.173 0.396,9.115 0.396,9.075 L0.396,9.016 C0.396,8.978 0.396,8.939 0.396,8.899 C0.433,6.595 1.255,4.573 2.860,2.835 C4.464,1.097 6.362,0.228 8.552,0.228 C11.120,0.228 13.234,1.380 14.896,3.685 C16.557,1.380 18.672,0.228 21.240,0.228 C23.429,0.228 25.327,1.097 26.932,2.835 C28.537,4.573 29.358,6.595 29.396,8.899 L29.396,8.958 ZM27.584,9.075 C27.584,9.037 27.584,8.997 27.584,8.958 C27.546,7.083 26.904,5.472 25.658,4.124 C24.412,2.776 22.939,2.103 21.240,2.103 C19.276,2.103 17.652,3.002 16.369,4.798 C15.991,5.306 15.500,5.560 14.896,5.560 C14.292,5.560 13.800,5.306 13.423,4.798 C12.139,3.002 10.515,2.103 8.552,2.103 C6.853,2.103 5.380,2.776 4.134,4.124 C2.888,5.472 2.246,7.083 2.209,8.958 C2.209,8.997 2.209,9.037 2.209,9.075 C2.246,9.154 2.265,9.232 2.265,9.310 C2.302,11.029 2.699,12.670 3.455,14.231 C4.210,15.794 5.069,17.083 6.032,18.098 C6.995,19.115 8.118,20.072 9.402,20.970 C10.685,21.869 11.724,22.513 12.517,22.903 C13.310,23.294 14.065,23.646 14.783,23.958 C15.500,23.646 16.264,23.294 17.077,22.903 C17.888,22.513 18.946,21.869 20.249,20.970 C21.551,20.072 22.693,19.115 23.675,18.098 C24.657,17.083 25.535,15.794 26.309,14.231 C27.083,12.670 27.489,11.048 27.527,9.368 C27.527,9.251 27.546,9.154 27.584,9.075 L27.584,9.075 Z"
                            class="fill-white"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="swiper-slide">
              <div class="product-card relative">
                <div class="product-card__title mb-4">
                  <a href="product-single.html"
                    class="text-dark hover:text-primary font-bold text-sm lg:text-base xl:text-lg line-clamp line-clamp--1"
                    title="400W Power House Gen. + One (1) 50W Panel">400W Power House Gen.
                    + One (1) 50W Panel</a>
                </div>
                <div
                  class="product-card__header border border-borderColor rounded-3xl relative aspect-square group overflow-hidden">

                  <div class="swiper product-card-swiper h-full">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                      <div class="swiper-slide">
                        <figure class="product-card__thumbnail overflow-hidden aspect-square">
                          <a href="product-single.html">
                            <img src="<?php echo get_template_directory_uri();?>/assets/images/product-1.jpg" alt="" class="w-full h-full object-cover" />
                          </a>
                        </figure>
                      </div>
                    </div>
                    <!-- If we need pagination -->
                    <div class="swiper-pagination"></div>

                  </div>
                  <span
                    class="product-card__discount-badge text-xs text-white bg-primary px-2 py-1 rounded-md font-medium">20%
                    OFF</span>
                </div>
                <div class="product-card__body pt-4">
                  <div class="grid grid-cols-12 gap-3 items-center">
                    <div class="product-card__price flex items-center col-span-12 lg:col-span-6">
                      <span
                        class="product-card__sale-price font-bold text-secondary text-base lg:text-lg xl:text-xl 2xl:text-2xl">$59.00</span>
                      <span
                        class="product-card__regular-price font-semibold line-through text-stone-400 ml-2 xl:ml-3 2xl:text-lg">$150.00</span>
                    </div>

                    <div
                      class="product-card__cta-container col-span-12 lg:col-span-6  flex items-center lg:justify-end">
                      <a href="#" class="product-card__btn--cart bg-primary mr-3" title="Add To Cart">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px"
                          height="20px">
                          <path fill-rule="evenodd" fill="rgb(255, 255, 255)"
                            d="M0.632,19.594 C0.402,19.359 0.288,19.081 0.288,18.760 L0.288,5.721 C0.288,5.400 0.402,5.122 0.632,4.887 C0.861,4.653 1.133,4.535 1.447,4.535 L3.765,4.535 C3.789,3.548 4.139,2.708 4.815,2.016 C5.491,1.325 6.300,0.979 7.242,0.979 C8.184,0.979 8.993,1.325 9.669,2.016 C10.345,2.708 10.695,3.548 10.719,4.535 L13.037,4.535 C13.351,4.535 13.623,4.653 13.852,4.887 C14.082,5.122 14.197,5.400 14.197,5.721 L14.197,18.760 C14.197,19.081 14.082,19.359 13.852,19.594 C13.623,19.828 13.351,19.946 13.037,19.946 L1.447,19.946 C1.133,19.946 0.861,19.828 0.632,19.594 ZM1.447,5.721 L1.447,18.760 L13.037,18.760 L13.037,5.721 L1.447,5.721 ZM4.924,4.535 L9.560,4.535 C9.536,3.869 9.301,3.307 8.854,2.850 C8.407,2.393 7.870,2.165 7.242,2.165 C6.614,2.165 6.077,2.393 5.630,2.850 C5.183,3.307 4.948,3.869 4.924,4.535 L4.924,4.535 ZM5.087,7.925 C4.978,7.814 4.924,7.672 4.924,7.499 C4.924,7.326 4.978,7.184 5.087,7.073 C5.196,6.962 5.334,6.906 5.503,6.906 L8.981,6.906 C9.149,6.906 9.289,6.962 9.397,7.073 C9.506,7.184 9.560,7.326 9.560,7.499 C9.560,7.672 9.506,7.814 9.397,7.925 C9.289,8.036 9.149,8.092 8.981,8.092 L5.503,8.092 C5.334,8.092 5.196,8.036 5.087,7.925 Z" />
                        </svg>
                      </a>

                      <a href="#" class="product-card__btn--wishlist bg-primary" title="Add To Wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="29px"
                          height="26px">
                          <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
                            d="M29.396,8.958 L29.396,9.016 L29.396,9.075 C29.396,9.115 29.386,9.173 29.368,9.251 C29.348,9.330 29.339,9.388 29.339,9.427 C29.301,11.029 28.990,12.561 28.405,14.026 C27.819,15.491 27.121,16.761 26.309,17.835 C25.497,18.910 24.534,19.915 23.421,20.852 C22.306,21.790 21.296,22.552 20.390,23.138 C19.484,23.724 18.540,24.260 17.558,24.749 C16.576,25.237 15.916,25.540 15.576,25.657 C15.236,25.774 14.971,25.872 14.783,25.950 C14.593,25.872 14.330,25.764 13.990,25.628 C13.650,25.491 12.999,25.189 12.036,24.720 C11.073,24.251 10.147,23.724 9.260,23.138 C8.373,22.552 7.382,21.781 6.287,20.823 C5.191,19.866 4.238,18.860 3.426,17.805 C2.614,16.751 1.925,15.491 1.359,14.026 C0.793,12.561 0.490,11.029 0.453,9.427 C0.453,9.388 0.443,9.330 0.424,9.251 C0.405,9.173 0.396,9.115 0.396,9.075 L0.396,9.016 C0.396,8.978 0.396,8.939 0.396,8.899 C0.433,6.595 1.255,4.573 2.860,2.835 C4.464,1.097 6.362,0.228 8.552,0.228 C11.120,0.228 13.234,1.380 14.896,3.685 C16.557,1.380 18.672,0.228 21.240,0.228 C23.429,0.228 25.327,1.097 26.932,2.835 C28.537,4.573 29.358,6.595 29.396,8.899 L29.396,8.958 ZM27.584,9.075 C27.584,9.037 27.584,8.997 27.584,8.958 C27.546,7.083 26.904,5.472 25.658,4.124 C24.412,2.776 22.939,2.103 21.240,2.103 C19.276,2.103 17.652,3.002 16.369,4.798 C15.991,5.306 15.500,5.560 14.896,5.560 C14.292,5.560 13.800,5.306 13.423,4.798 C12.139,3.002 10.515,2.103 8.552,2.103 C6.853,2.103 5.380,2.776 4.134,4.124 C2.888,5.472 2.246,7.083 2.209,8.958 C2.209,8.997 2.209,9.037 2.209,9.075 C2.246,9.154 2.265,9.232 2.265,9.310 C2.302,11.029 2.699,12.670 3.455,14.231 C4.210,15.794 5.069,17.083 6.032,18.098 C6.995,19.115 8.118,20.072 9.402,20.970 C10.685,21.869 11.724,22.513 12.517,22.903 C13.310,23.294 14.065,23.646 14.783,23.958 C15.500,23.646 16.264,23.294 17.077,22.903 C17.888,22.513 18.946,21.869 20.249,20.970 C21.551,20.072 22.693,19.115 23.675,18.098 C24.657,17.083 25.535,15.794 26.309,14.231 C27.083,12.670 27.489,11.048 27.527,9.368 C27.527,9.251 27.546,9.154 27.584,9.075 L27.584,9.075 Z"
                            class="fill-white"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div> -->

          <div class="swiper-pagination"></div>
        </div>
      </div>
    </section>

    <!-- GET IN TOUCH SECTION -->
    <section class="get-in-touch-section bg-light">
      <div class="container relative section--py">
        <div class="grid grid-cols-12 lg:gap-7 items-center">
          <div class="col-span-12 lg:col-span-6 2xl:col-span-5 text-center">
            <img src="<?php echo get_template_directory_uri();?>/assets/images/get-in-touch-col-bg.png" alt=""
              class="inline-block md:w-1/2 lg:w-auto xl:absolute xl:left-0 xl:bottom-0 2xl:-translate-x-40">
          </div>
          <div class="col-span-12 lg:col-span-6 2xl:col-span-7">
            <div
              class="form-container bg-white shadow rounded-2xl py-10 px-4 sm:px-6 md:p-10 xl:px-12 xl:py-14 2xl:px-14 2xl:py-[4.5rem] relative">
              <h2 class="section__heading text-center text-primary font-heading uppercase mb-10 lg:mb-14 xl:mb-20 2xl:mb-[6.25rem]">Get In Touch</h2>
              <div  class="form get-in-touch-form" id="getInTouchForm">
                <?php echo do_shortcode('[contact-form-7 id="7" title="Get In Touch"]');?>
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