$(document).ready(function () {
  // write all back end and form related js here...

  // console.log("test");

  // Navigation active links
  var current = location.pathname;
  current = current.replace("/", "");

  // console.log(current);
  if (current !== "") {
    $(".site-header .nav-menu li").removeClass("active");
    $(".site-header .nav-menu li a").each(function () {
      var $this = $(this);
      // if the current path is like this link, make it active
      if ($this.attr("href") === current) {
        $this.parent().addClass("active");
      }
    });
  } 
  // else {
  //   $(".site-header .nav-menu li:first-child").addClass("active");
  // }

  // Newsletter Form
  $("#newsletterForm").validate({
    rules: {
      nf_email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    messages: {
      nf_email: {
        required: "This field is required",
        pattern: "Please enter a valid email.",
      },
    },
    submitHandler: function (form, e) {
      e.preventDefault();
      // form.submit();
      form.reset();
    },
  });

  // CONTACT FORM
  $("#contactForm").validate({
    rules: {
      cf_phone: {
        required: true,
        pattern: /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      },
      cf_email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    messages: {
      cf_phone: {
        required: "This field is required.",
        pattern: "Please enter a valid phone number.",
      },
      cf_email: {
        required: "This field is required.",
        pattern: "Please enter a valid email.",
      },
    },
    submitHandler: function (form, e) {
      e.preventDefault();
      form.reset();
    },
  });

  // LOGIN FORM
  $("#loginForm").validate({
    rules: {
      lf_email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    messages: {
      lf_email: {
        required: "This field is required.",
        pattern: "Please enter a valid email.",
      },
    },
    submitHandler: function (form, e) {
      e.preventDefault();
      form.reset();
    },
  });

  // REGISTER FORM
  $("#registerForm").validate({
    rules: {
      rf_phone: {
        required: true,
        pattern: /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      },
      rf_email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    messages: {
      rf_phone: {
        required: "This field is required.",
        pattern: "Please enter a valid phone number.",
      },
      rf_email: {
        required: "This field is required.",
        pattern: "Please enter a valid email.",
      },
    },
    submitHandler: function (form, e) {
      e.preventDefault();
      form.reset();
    },
  });

  // ADD ADDRSSS FORM
  $("#addAddressForm").validate({
    rules: {
      aaf_phone: {
        required: true,
        pattern: /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      },
      aaf_email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      aaf_pin: {
        required: true,
        pattern: /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/,
      },
    },
    messages: {
      aaf_phone: {
        required: "This field is required.",
        pattern: "Please enter a valid phone number.",
      },
      aaf_email: {
        required: "This field is required.",
        pattern: "Please enter a valid email.",
      },
      aaf_pin: {
        required: "This field is required.",
        pattern: "Please enter a valid pin code.",
      },
    },
    submitHandler: function (form, e) {
      e.preventDefault();
      form.reset();
    },
  });

  $.validator.addMethod(
    "pattern",
    function (value, element, regexp) {
      return this.optional(element) || regexp.test(value);
    },
    "Please check your input."
  );

  // function alertNotification(el, msgType, msg) {
  //   resetNotification(el);

  //   el.removeClass("hidden").addClass("alert--" + msgType);
  //   const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`;
  //   const dangerIcon = `<i class="fa-solid fa-circle-exclamation"></i>`;
  //   el.find(".alert__message").text(msg);

  //   if (msgType === "success") {
  //     el.find(".alert__icon").html(successIcon);
  //   }

  //   if (msgType === "danger") {
  //     el.find(".alert__icon").html(dangerIcon);
  //   }
  // }

  // $(".alert__btn--close").each(function () {
  //   $(this).on("click", function (e) {
  //     e.preventDefault();
  //     resetNotification($(this).closest(".alert"));
  //     $(this).closest(".alert").addClass("hidden");
  //   });
  // });

  // function resetNotification(el) {
  //   el.removeClass("alert--success alert--danger");
  //   el.find(".alert__message").text("");
  //   el.find(".alert__icon").html("");
  // }

  // CHECKOUT PAGE ADD ADDRESS FORM
  $(".checkout-section .checkout-step .address-list .item").each(function () {
    $(this).on("click", function () {
      $(".checkout-section .checkout-step .address-list .item").attr("data-selected", "false");
      $(this).attr("data-selected", "true");
    });
  });

  $(".btn--add-address").each(function () {
    $(this).on("click", function () {
      $(".add-address-form").removeClass("hidden");
    });
  });

  // ADD TO CART FUNCTION - CART OFFCANVAS OPENING
  const addToCartBtns = $(".product-card .product-card__btn--cart");
  addToCartBtns.each(function () {
    $(this).on("click", function (e) {
      e.preventDefault();
      var getID = $(this).closest(".product-card").attr("data-id");
      console.log(getID);

      // OPENING CART OFFCANVAS
      $("#cartOffcanvas").offcanvas("show");
    });
  });

  // PRICE RANGE FILTER
  const rangeInput = document.querySelectorAll(".range-input input"),
    priceInput = document.querySelectorAll(".price-input input"),
    range = document.querySelector(".slider .progress");
  let priceGap = 1000;

  priceInput.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minPrice = parseInt(priceInput[0].value),
        maxPrice = parseInt(priceInput[1].value);

      if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
        if (e.target.className === "input-min") {
          rangeInput[0].value = minPrice;
          range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
        } else {
          rangeInput[1].value = maxPrice;
          range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
        }
      }
    });
  });

  rangeInput.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value);

      if (maxVal - minVal < priceGap) {
        if (e.target.className === "range-min") {
          rangeInput[0].value = maxVal - priceGap;
        } else {
          rangeInput[1].value = minVal + priceGap;
        }
      } else {
        priceInput[0].value = minVal;
        priceInput[1].value = maxVal;
        range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
        range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
      }

      // console.log(minVal, maxVal);
    });
  });
});
