<div class="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3">
<div class="filters sticky bg-primary rounded-3xl px-4 py-8 sm:px-6 xl:p-8">
  <div class="filter-block pt-3 first:pt-0">
    <div class="filter-block__header flex items-center justify-between border-b border-b-borderColor pb-3">
      <span class="text-white text-xl lg:text-2xl 2xl:text-3xl font-heading uppercase">Categories</span>
      <button class="filter__btn--control p-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5">
          <path
            d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
            class="fill-white" />
        </svg>
      </button>
    </div>
    <div class="filter-block__body py-4">
      <!-- <ul>
        <li class="mb-2 last:mb-0">
          <label class="flex items-center text-white">
            <input type="checkbox" name="filter_cat_1" value="category_title" class="flex-shrink-0" />
            <span class="ml-2">Alkaline Water Ionizers!</span>
          </label>
        </li>
        <li class="mb-2 last:mb-0">
          <label class="flex items-center text-white">
            <input type="checkbox" name="filter_cat_1" value="category_title" class="flex-shrink-0" />
            <span class="ml-2">Water Ionizer Replacement Filters</span>
          </label>
        </li>
        <li class="mb-2 last:mb-0">
          <label class="flex items-center text-white">
            <input type="checkbox" name="filter_cat_1" value="category_title" class="flex-shrink-0" />
            <span class="ml-2">Flexible Solar Panels</span>
          </label>
        </li>
        <li class="mb-2 last:mb-0">
          <label class="flex items-center text-white">
            <input type="checkbox" name="filter_cat_1" value="category_title" class="flex-shrink-0" />
            <span class="ml-2">Flexible Solar Panels</span>
          </label>
        </li>
      </ul> -->
      <?php echo do_shortcode('[yith_wcan_filters slug="default-preset"]');?>      
    </div>
  </div>
  <div class="filter-block pt-3 first:pt-0">
    <div class="filter-block__header flex items-center justify-between border-b border-b-borderColor pb-3">
      <span class="text-white text-xl lg:text-2xl 2xl:text-3xl font-heading uppercase">Price</span>
      <button class="filter__btn--control p-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5">
          <path
            d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
            class="fill-white" />
        </svg>
      </button>
    </div>
    <div class="filter-block__body py-4">
      <div class="wrapper">
        <!-- <div class="slider">
          <div class="progress"></div>
        </div>
        <div class="range-input">
          <input type="range" class="range-min" min="0" max="10000" value="2500" step="100" />
          <input type="range" class="range-max" min="0" max="10000" value="7500" step="100" />
        </div>
        <div class="price-input">
          <div class="field text-white">
            <span>Min</span>
            <input type="number" class="input-min text-dark" value="2500" />
          </div>
          <div class="separator">-</div>
          <div class="field text-white">
            <span>Max</span>
            <input type="number" class="input-max text-dark" value="7500" />
          </div>
        </div> -->
        <?php //echo do_shortcode('[br_filter_single filter_id=55]');?>        
        <?php get_sidebar('sitebar'); ?>        
      </div>
    </div>
  </div>
</div>
</div>