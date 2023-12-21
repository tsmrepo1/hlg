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


        <?php
            while( have_rows('banner_managment') ) : the_row(); 
        ?>
            <div class="swiper-slide">
              <div class="py-[14rem] bg-light bg-center bg-cover bg-no-repeat -2xl:py-[11rem] -lg:py-[7rem] -md:py-24" style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/hero-banner-1.jpg)">
                <div class="container">
                  <div class="-md:bg-white -md:bg-opacity-50 -md:p-5">
                    <div class="content-box w-[60%] mb-9 -lg:w-[65%] -md:w-full -md:text-center -md:mb-7">
                      <?php if(!empty(get_sub_field('caption_1'))){ ?>
                        <h2><?php echo get_sub_field('caption_1'); ?></h2>
                      <?php } ?>
                      <?php if(!empty(get_sub_field('caption_2'))){ ?>
                      <h1>
                        <?php echo get_sub_field('caption_2'); ?>
                      </h1>
                      <?php } ?>
                      <?php if(!empty(get_sub_field('caption_3'))){ ?>
                        <h3><?php echo get_sub_field('caption_3'); ?></h3>
                      <?php } ?>
                    </div>
                    <?php if(!empty(get_sub_field('product_link'))){ ?>
                    <div class="-md:text-center">
                      <a href="<?php echo get_sub_field('product_link'); ?>" class="btn btn-primary">Order Now</a>
                    </div>
                    <?php } ?>
                  </div>
                </div>
              </div>
            </div>
        <?php endwhile; ?> 

         
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
            
          <?php if( get_field('right_panel_content') ): ?>
            
            <div class="col-span-3 -xl:col-span-12 -xl:text-center">
              <div class="content-box text-2xl font-heading mb-[2.375rem] -xl:px-[16%] -lg:px-[8%] -md:px-0 -md:text-xl -md:mb-6">
                <?php echo the_field('right_panel_content'); ?>
              </div>

              <div>
                <div class="swiper-button-prev--top-products inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] rounded-full border border-[#d8dede] text-dark hover:bg-primary hover:text-white hover:border-primary mr-4"><i class="fa-solid fa-arrow-left-long"></i></div>
                <div class="swiper-button-next--top-products inline-flex items-center justify-center w-[2.375rem] h-[2.375rem] rounded-full border border-[#d8dede] text-dark hover:bg-primary hover:text-white hover:border-primary"><i class="fa-solid fa-arrow-right-long"></i></div>
              </div>
            </div>
          <?php endif; ?>



            <div class="col-span-9 -xl:col-span-12">
              <div class="-mx-3">
                <div class="swiper products-swiper">
                  <div class="swiper-wrapper -lg:pb-12">


                  <?php
                      $argsFC = array(
                      'post_type' => 'product',
                      'meta_query'=> array(
                          array(
                          'key' => 'view_on_home_page',
                          'value' => 'Yes'
                          )
                      ),
                      'posts_per_page' => 8
                      );
                      $loopFC = new WP_Query( $argsFC );
                      if ( $loopFC->have_posts() ) {
                           while ( $loopFC->have_posts() ) : $loopFC->the_post();
                           $thumbFC = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'full' );
                           $mrp = get_post_meta( get_the_ID(), '_regular_price', true);
                           $seling_price = get_post_meta( get_the_ID(), '_sale_price', true);
                              if(!empty($mrp) && !empty($seling_price)){ 
                                  $dsp = (int)((($mrp - $seling_price) / $mrp) * 100);
                              }else{
                                  $dsp ='';
                              }
                    ?>

                    <div class="swiper-slide p-3">
                      <div class="product-card bg-white p-3 rounded-[0.875rem] shadow-[0_10px_9px_rgba(0,0,0,0.06)]">
                        <div class="relative">
                          <figure class="border border-[#f2f2f2] rounded-[0.875rem] overflow-hidden">
                            <a href="<?php the_permalink(); ?>" title="HLG Vedica 1 Litre Water Bottles">
                              <?php if($thumbFC != ''){ ?>
                                  <img src="<?php echo $thumbFC['0']; ?>" alt="<?php the_title(); ?>">
                              <?php } else{ ?>
                              <img src="<?php bloginfo('template_directory'); ?>/assets/images/no_image.jpg" alt="">
                              <?php } ?>
                            </a>
                          </figure>
                          <?php if($dsp!=''){ ?>
                          <span class="bg-primary font-heading rounded-[3.75rem] leading-[1] text-white absolute top-3 left-1 text-sm px-5 py-1"><?php echo $dsp;?>%</span><?php } ?>
                        </div>

                        <div class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">
                          <!-- <span class="text-[#b9b9b9] font-bold text-lg mr-2">$10.00</span>
                          <span class="text-2xl font-bold text-[#f00000]">$10.00</span> -->
                          <?php if($seling_price!=''){ ?>
                          <span class="text-2xl font-bold text-[#f00000]">$<?php echo $seling_price; ?></span>
                          <span class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">$<?php echo $mrp; ?></span>
                          <?php  }else{ ?>
                          <span class="text-2xl font-bold text-[#f00000]">$<?php echo $mrp; ?></span>
                          <?php } ?>
                        </div>
                        <div class="text-center mb-7">
                          <h6 class="text-lg text-primary font-normal"><?php the_title(); ?></h6>
                          <p class="text-sm"><?php echo wp_trim_words( get_the_content(), 10, '...' ); ?></p>
                        </div>

                        <div class="flex items-center">
                          <a href="<?php the_permalink(); ?>" class="btn btn-primary w-full btn--order">Order Now</a>
                          <?php echo do_shortcode("[ti_wishlists_addtowishlist loop=no]");?>
                        </div>
                      </div>
                    </div>

                    <?php                                       
                    endwhile;
                    } else {
                        echo __( 'No products found' );
                    }
                    wp_reset_postdata();
                    ?>
                    
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
          <?php if( get_field('adv_section_right_image') ): ?>
          <div class="inner-wrap relative rounded-2xl bg-center bg-cover bg-no-repeat px-[5.625rem] py-[4.1875rem] -3xl:px-[4.625rem] -2xl:px-[3.625rem] -lg:px-10 -lg:py-[3.25rem] -md:px-5" style="background-image: url(<?php the_field('adv_section_right_image'); ?>)">
          <?php endif; ?>
            <div class="relative w-1/2 -lg:w-[60%] -md:w-full -md:text-center">
              <?php if( get_field('adv_section_content') ): ?>
              <div class="content-box mb-6">
                <?php the_field('adv_section_content'); ?>
              </div>
              <?php endif; ?>

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

                <?php 
                $terms = get_terms(
                array(
                'taxonomy'   => 'product_cat', // Custom Post Type Taxonomy Slug
                'hide_empty' => false,
                'order'      => 'asc'
                )
                );
                foreach ($terms as $term) {
                ?>
                <li><a href="#tab<?php echo $term->term_id; ?>" class="py-5 px-10 rounded-[3.75rem] font-heading text-lg capitalize inline-block whitespace-nowrap -md:py-4 -md:px-8"><?php echo $term->name; ?></a></li>
                <?php } ?>
              </ul>
            </div>

            <div class="tabs-content">
              <div id="tab1">
                <div class="-mx-3">
                  <div class="swiper products-swiper-main">
                    <div class="swiper-wrapper pb-12">
                    <?php
                    $argsPro = array (
                    'post_type'              => 'product',
                    'post_status'            => 'publish',
                    'order'                  => 'ASC',
                    'posts_per_page'         => -1
                    );
                    $bannerPro = new WP_Query( $argsPro );
                    if ( $bannerPro->have_posts() ) {
                    while ( $bannerPro->have_posts() ) {
                    $bannerPro->the_post();
                    $image1Pro = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'full' );

                    $mrp = get_post_meta( get_the_ID(), '_regular_price', true);
                    $seling_price = get_post_meta( get_the_ID(), '_sale_price', true);
                    if(!empty($mrp) && !empty($seling_price)){ 
                        $dsp = (int)((($mrp - $seling_price) / $mrp) * 100);
                    }else{
                        $dsp ='';
                    }


                    ?>
                      <div class="swiper-slide p-3">
                        <div class="product-card bg-white p-3 rounded-[0.875rem] shadow-[0_10px_9px_rgba(0,0,0,0.06)]">
                          <div class="relative">
                            <figure class="border border-[#f2f2f2] rounded-[0.875rem] overflow-hidden">
                              <a href="<?php echo get_permalink(); ?>" title="<?php the_title(); ?>">
                                <?php if($image1Pro != ''){ ?>
                                  <img src="<?php echo $image1Pro['0']; ?>" alt="<?php the_title(); ?>">
                              <?php } else{ ?>
                              <img src="<?php bloginfo('template_directory'); ?>/assets/images/no_image.jpg" alt="">
                              <?php } ?>
                              </a>
                            </figure>

                          <?php if($dsp!=''){ ?>
                          <span class="bg-primary font-heading rounded-[3.75rem] leading-[1] text-white absolute top-3 left-1 text-sm px-5 py-1"><?php echo $dsp;?>%</span><?php } ?>
                          </div>

                          <div class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">
                          <?php if($seling_price!=''){ ?>
                          <span class="text-2xl font-bold text-[#f00000]">$<?php echo $seling_price; ?></span>
                          <span class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">$<?php echo $mrp; ?></span>
                          <?php  }else{ ?>
                          <span class="text-2xl font-bold text-[#f00000]">$<?php echo $mrp; ?></span>
                          <?php } ?>
                          </div>
                          <div class="text-center mb-7">
                            <h6 class="text-lg text-primary font-normal"><?php the_title(); ?></h6>
                            <p class="text-sm"><?php echo wp_trim_words( get_the_content(), 10, '...' ); ?></p>
                          </div>

                          <div class="flex items-center">
                            <a href="<?php echo get_permalink(); ?>" class="btn btn-primary w-full btn--order">Order Now</a>
                            <?php echo do_shortcode("[ti_wishlists_addtowishlist loop=no]");?>
                          </div>
                        </div>
                      </div>

                    <?php }
                     } else {
                       ?>
                       <?php  echo __( 'No Product Available' );
                     } wp_reset_postdata(); 
                    ?>

                     

                      
                    </div>

                    <div class="swiper-pagination"></div>
                  </div>
                </div>
              </div>



              <?php 
              $terms = get_terms(
              array(
              'taxonomy'   => 'product_cat', // Custom Post Type Taxonomy Slug
              'hide_empty' => false,
              'order'      => 'asc'
              )
              );
              foreach ($terms as $term) :

              ?>

              <div id="tab<?php echo $term->term_id; ?>">
                
              <div class="-mx-3">
                  <div class="swiper products-swiper-main">
                    <div class="swiper-wrapper pb-12">
                  <?php 
                  $args = array(
                  'post_type' => 'product',
                  'order' => 'ASC',
                  'tax_query' => array(
                  array(
                      'taxonomy' => 'product_cat',
                      'field' => 'slug',
                      'terms' => $term->slug,
                  )
                  ),
                  'posts_per_page' => -1
                  );
                  $loop = new WP_Query( $args );
                  while ( $loop->have_posts() ) : $loop->the_post();
                  $imgurl = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'full' );
                  $title=get_the_title($post->ID);

                  $mrp = get_post_meta( get_the_ID(), '_regular_price', true);
                    $seling_price = get_post_meta( get_the_ID(), '_sale_price', true);
                    if(!empty($mrp) && !empty($seling_price)){ 
                        $dsp = (int)((($mrp - $seling_price) / $mrp) * 100);
                    }else{
                        $dsp ='';
                    }

                    
                  ?>

                    <div class="swiper-slide p-3">
                            <div class="product-card bg-white p-3 rounded-[0.875rem] shadow-[0_10px_9px_rgba(0,0,0,0.06)]">
                              <div class="relative">
                                <figure class="border border-[#f2f2f2] rounded-[0.875rem] overflow-hidden">
                                  <a href="<?php echo get_permalink(); ?>" title="<?php the_title(); ?>">
                                    <?php if($imgurl != ''){ ?>
                                        <img src="<?php echo $imgurl['0']; ?>" alt="<?php the_title(); ?>">
                                    <?php } else{ ?>
                                    <img src="<?php bloginfo('template_directory'); ?>/assets/images/no_image.jpg" alt="">
                                    <?php } ?>


                                  </a>
                                </figure>

                                <?php if($dsp!=''){ ?>
                                <span class="bg-primary font-heading rounded-[3.75rem] leading-[1] text-white absolute top-3 left-1 text-sm px-5 py-1"><?php echo $dsp;?>%</span>
                                <?php } ?>
                              </div>

                              <div class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">
                              <?php if($seling_price!=''){ ?>
                              <span class="text-2xl font-bold text-[#f00000]">$<?php echo $seling_price; ?></span>
                              <span class="my-4 py-4 px-3 text-center border border-[#f2f2f2] rounded-[0.875rem]">$<?php echo $mrp; ?></span>
                              <?php  }else{ ?>
                              <span class="text-2xl font-bold text-[#f00000]">$<?php echo $mrp; ?></span>
                              <?php } ?>
                              </div>
                              <div class="text-center mb-7">
                                <h6 class="text-lg text-primary font-normal"><?php the_title(); ?></h6>
                                <p class="text-sm"><?php echo wp_trim_words( get_the_content(), 10, '...' ); ?></p>
                              </div>

                              <div class="flex items-center">
                                <a href="<?php echo get_permalink(); ?>" class="btn btn-primary w-full btn--order">Order Now</a>
                                <?php echo do_shortcode("[ti_wishlists_addtowishlist loop=no]");?>
                              </div>
                            </div>
                          </div>

                        <?php endwhile; wp_reset_postdata(); ?>
                      </div>
                    </div>
                  </div>


              </div>

              <?php endforeach;  ?>

              
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


                <?php
                    while( have_rows('testimonial_section') ) : the_row(); 
                ?>

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
                      <?php if(!empty(get_sub_field('review_content'))){ ?>
                      <div class="content-box my-9 -md:my-7">
                        <?php echo get_sub_field('review_content'); ?>
                      </div>
                      <?php } ?>
                      <?php if(!empty(get_sub_field('client_name'))){ ?>
                      <div>
                        <h4 class="mb-0 leading-[1] text-dark"><?php echo get_sub_field('client_name'); ?></h4>
                      </div>
                      <?php } ?>
                      <?php if(!empty(get_sub_field('client_image'))){ ?>
                      <figure class="absolute left-9 -top-14 w-[7rem] h-[7rem] inline-flex items-center justify-center rounded-full overflow-hidden border-4 border-primary z-10">
                        <img src="<?php echo get_sub_field('client_image'); ?>" alt="" class="w-full h-full object-cover" />
                      </figure>
                      <?php } ?>
                    </div>

                    <span class="w-[8.25rem] h-[8.25rem] bg-primary rounded-full block absolute left-[1.5625rem] -top-[4.125rem] z-[5]">&nbsp;</span>
                  </div>
                </div>

                <?php endwhile; ?>
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
              <?php if( get_field('schedule_content') ): ?>
              <div class="content-box font-heading">
                <?php echo the_field('schedule_content'); ?>
              </div>
              <?php endif; ?>
              <?php if( get_field('schedule_link') ): ?>
              <div class="mt-[2.125rem]">
                <a href="<?php echo the_field('schedule_link'); ?>" class="btn btn-primary w-full max-w-[37.625rem]">Test Your Drinking Water Now</a>
              </div>
              <?php endif; ?>
            </div>
          </div>
        </div>
        <img src="<?php echo get_template_directory_uri();?>/assets/images/tap-call-img.png" alt="" class="absolute bottom-0 right-0 z-[5] -3xl:max-w-[43.75rem] -3xl:-right-[4rem] -2xl:-right-[8rem] -xl:-right-[16rem] -lg:-right-[20rem] -lg:max-w-[42.875rem] -md:hidden">
      </section>

      <!-- WHY CHOOSE US SECTION -->
      <section class="why-choose-us-section pt-20 bg-center bg-cover bg-no-repeat -lg:pt-16 -md:pt-[3.75rem]" style="background-image: url(assets/images/why-choose-us-bg-shape.png)">
        <div class="container">
          <div class="grid grid-cols-12 gap-x-7 items-center -lg:gap-y-10 -lg:gap-x-0">

            <?php if( get_field('why_choose_us_content') ): ?>
            <div class="col-span-6 -lg:col-span-12 -lg:text-center">
              <div class="content-box">
                <?php echo the_field('why_choose_us_content'); ?>
              </div>
              <div class="mt-[3.25rem] -2xl:mt-10">
                <a href="#" class="btn btn-primary">More About Us</a>
              </div>
            </div>
            <?php endif; ?>


            <div class="col-span-6 -lg:col-span-12">
              <div class="grid grid-cols-2 gap-7 -xl:gap-6 -md:grid-cols-1">

                <?php
                    while( have_rows('why_choose_us_managment') ) : the_row(); 
                ?>
                <div class="why-us-card rounded-[0.8125rem] bg-white shadow-[0px_5px_9px_rgba(0,0,0,0.08)] text-center px-6 py-[3.625rem] -3xl:py-10 -2xl:px-5">
                  <figure class="mb-6 inline-block">
                    <img src="<?php echo get_template_directory_uri();?>/assets/images/test-tube (1).png" alt="" />
                  </figure>
                  <div class="content-box">
                    <?php if(!empty(get_sub_field('why_choose_us_title'))){ ?>
                      <h3><?php echo get_sub_field('why_choose_us_title'); ?></h3>
                    <?php } ?>
                    <?php if(!empty(get_sub_field('why_choose_us_description'))){ ?>
                      <?php echo get_sub_field('why_choose_us_description'); ?>
                    <?php } ?>
                  </div>
                </div>
                <?php endwhile; ?>
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
              <?php if( get_field('cta_caption') ): ?>
              <h2><?php echo the_field('cta_caption'); ?></h2>
              <?php endif; ?>
              <?php if( get_field('cta_phone_no') ): ?>
              <h3>Call Us: <a href="tel:<?php echo the_field('cta_phone_no'); ?>"><?php echo the_field('cta_phone_no'); ?></a></h3>
              <?php endif; ?>
            </div>
            <?php if( get_field('cta_link') ): ?>
            <div class="mx-auto max-w-[27.5rem]">
              <a href="<?php echo the_field('cta_link'); ?>" class="btn btn-white w-full">More About Us</a>
            </div>
            <?php endif; ?>
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
                <?php if( get_field('quick_contact_content') ): ?>
                <div class="content-box mt-8 mb-10 -xl:mb-8">
                  <?php echo the_field('quick_contact_content'); ?>
                </div>
                <?php endif; ?>

                <div class="contact-info-wrap inline-flex items-center">
                  <figure class="flex-shrink-0 w-[3.75rem] h-[3.75rem] inline-flex items-center justify-center rounded-full border-2 border-[#e4e4e4]">
                    <img src="<?php echo get_template_directory_uri();?>/assets/images/phone-icon.png" alt="" width="26" height="26" />
                  </figure>
                  <?php if( get_field('cta_phone_no') ): ?>
                  <div class="ml-[0.9375rem] font-heading">
                    <h4>Quick Contact</h4>
                    <h3><a href="tel:+<?php echo the_field('cta_phone_no'); ?>">+<?php echo the_field('cta_phone_no'); ?></a></h3>
                  </div>
                  <?php endif; ?>
                </div>
              </div>
            </div>

            <div class="col-span-6 -lg:col-span-12">
              <div class="pt-[3.5rem] pb-[3.375rem] bg-center bg-cover bg-no-repeat rounded-t-xl rounded-r-xl" style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/white-wolf-col-bg.jpg)">
                <div class="ww-wolf-form-wrap max-w-[33.375rem] ml-11 px-[1.375rem] py-[1.875rem] bg-white -2xl:max-w-[30rem] -xl:max-w-[25rem] -lg:max-w-[75%] -lg:mx-auto -md:max-w-full -md:mx-3">
                  <?php echo do_shortcode('[contact-form-7 id="302" title="Get In Touch Form" html_class="form white-wolf-form"]');?>
                  

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