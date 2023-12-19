!function(){"use strict";var e={};(function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})})(e);var t=window.wc.tracks;function o(e,t){let c=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;c>6||setTimeout((()=>{document.querySelector(e)?t():o(e,t,++c)}),500)}productScreen&&"list"===productScreen.name&&(()=>{const e=document.querySelectorAll(".row-actions span"),o=document.querySelector("#bulk-action-selector-top"),c=document.querySelector("#doaction"),n=document.querySelector("#bulk-edit .cancel"),r=document.querySelector("#bulk_edit"),l=document.querySelectorAll("#the-list .featured a"),d=document.querySelector("#post-query-submit"),i=document.querySelector("#product_cat"),u=document.querySelector("#dropdown_product_type"),a=document.querySelector("#search-submit"),s=document.querySelector("#post-search-input"),v=document.querySelectorAll(".wp-list-table.posts thead .sortable a, .wp-list-table.posts thead .sorted a"),_=document.querySelector('[name="stock_status"]'),m=e=>{const t=document.querySelector(e);return!!t&&""!==t.value&&"-1"!==t.value};null==d||d.addEventListener("click",(function(){(0,t.recordEvent)("products_list_filter_click",{search_string_length:null==s?void 0:s.value.length,filter_category:""!==i.value,filter_product_type:u.value,filter_stock_status:_.value})})),null==c||c.addEventListener("click",(function(){const e=document.querySelectorAll('[name="post[]"]:checked').length;(0,t.recordEvent)("products_list_bulk_actions_click",{selected_action:o.value,product_number:e})})),null==r||r.addEventListener("click",(function(){var e,o;(0,t.recordEvent)("products_list_bulk_edit_update",{product_number:null===(e=document.querySelector("#bulk-titles"))||void 0===e?void 0:e.children.length,product_categories:(null===(o=document.querySelectorAll('[name="tax_input[product_cat][]"]:checked'))||void 0===o?void 0:o.length)>0,comments:m('[name="comment_status"]'),status:m('[name="_status"]'),product_tags:m('[name="tax_input[product_tag]"]'),price:m('[name="change_regular_price"]'),sale:m('[name="change_sale_price"]'),tax_status:m('[name="_tax_status"]'),tax_class:m('[name="_tax_class"]'),weight:m('[name="change_weight"]'),dimensions:m('[name="change_dimensions"]'),shipping_class:m('[name="_shipping_class"]'),visibility:m('[name="_visibility"]'),featured:m('[name="_featured"]'),stock_status:m('[name="_stock_status"]'),manage_stock:m('[name="_manage_stock"]'),stock_quantity:m('[name="change_stock"]'),backorders:m('[name="_backorders"]'),sold_individually:m('[name="_sold_individually"]')})})),null==n||n.addEventListener("click",(function(){(0,t.recordEvent)("products_list_bulk_edit_cancel")})),e.forEach((e=>{e.addEventListener("click",(function(e){var o,c;const n=null===(o=e.target)||void 0===o||null===(c=o.parentElement)||void 0===c?void 0:c.classList[0],r={edit:"edit",inline:"quick_edit",trash:"trash",view:"preview",duplicate:"duplicate"};n&&r[n]&&(0,t.recordEvent)("products_list_product_action_click",{selected_action:r[n]})}))})),l.forEach((e=>{e.addEventListener("click",(function(e){const o=e.target.classList.contains("not-featured");(0,t.recordEvent)("products_list_featured_click",{featured:o?"yes":"no"})}))})),null==a||a.addEventListener("click",(function(){(0,t.recordEvent)("products_search",{search_string_length:s.value.length,filter_category:""!==i.value,filter_product_type:u.value,filter_stock_status:_.value})})),v.forEach((e=>{e.addEventListener("click",(function(e){const o=e.target.closest("th");if(!o)return;const c=o.classList.contains("asc");(0,t.recordEvent)("products_list_column_header_click",{field_slug:o.id,order:c?"desc":"asc"})}))}))})(),window.wp.i18n;var c=window.wc.data,n=window.wp.data;window.wc.navigation;const r="customer-effort-score-exit-page";let l=!1;(0,n.resolveSelect)(c.OPTIONS_STORE_NAME).getOption("woocommerce_allow_tracking").then((e=>{l="yes"===e}));const d={},i=(e,t)=>{d[e]=()=>{t()&&(e=>{if(!window.localStorage||!l)return;let t=(()=>{if(!window.localStorage)return[];const e=window.localStorage.getItem(r),t=e?JSON.parse(e):[];return Array.isArray(t)?t:[]})();t.find((t=>t===e))||t.push(e),t=t.slice(-10),window.localStorage.setItem(r,JSON.stringify(t))})(e)},window.addEventListener("unload",d[e])},u=()=>{var e,t,o,c,n,r,l,d,i,u,a,s,v;const _=document.querySelectorAll(".block-editor").length>0;let m="",p="";if(_){var g;m=null===(g=document.querySelector(".block-editor-rich-text__editable"))||void 0===g?void 0:g.value}else{p=document.querySelector('[name="tax_input[product_tag]"]').value;const e=document.querySelector("#content");e&&(y=e,"none"!==window.getComputedStyle(y).display)?m=e.value:"object"==typeof tinymce&&tinymce.get("content")&&(m=tinymce.get("content").getContent())}var y;return{product_id:null===(e=document.querySelector("#post_ID"))||void 0===e?void 0:e.value,product_type:null===(t=document.querySelector("#product-type"))||void 0===t?void 0:t.value,is_downloadable:null!==(o=document.querySelector("#_downloadable"))&&void 0!==o&&o.checked?"Yes":"No",is_virtual:null!==(c=document.querySelector("#_virtual"))&&void 0!==c&&c.checked?"Yes":"No",manage_stock:null!==(n=document.querySelector("#_manage_stock"))&&void 0!==n&&n.checked?"Yes":"No",attributes:document.querySelectorAll(".woocommerce_attribute").length,categories:document.querySelectorAll('[name="tax_input[product_cat][]"]:checked').length,cross_sells:document.querySelectorAll("#crosssell_ids option").length?"Yes":"No",description:""!==m.trim()?"Yes":"No",enable_reviews:null!==(r=document.querySelector("#comment_status"))&&void 0!==r&&r.checked?"Yes":"No",is_block_editor:_,menu_order:0!==parseInt(null!==(l=null===(d=document.querySelector("#menu_order"))||void 0===d?void 0:d.value)&&void 0!==l?l:0,10)?"Yes":"No",product_gallery:document.querySelectorAll("#product_images_container .product_images > li").length,product_image:parseInt(null===(i=document.querySelector("#_thumbnail_id"))||void 0===i?void 0:i.value,10)>0?"Yes":"No",purchase_note:null!==(u=document.querySelector("#_purchase_note"))&&void 0!==u&&u.value.length?"Yes":"No",sale_price:null!==(a=document.querySelector("#_sale_price"))&&void 0!==a&&a.value?"Yes":"No",short_description:null!==(s=document.querySelector("#excerpt"))&&void 0!==s&&s.value.length?"Yes":"No",tags:p.length>0?p.split(",").length:0,upsells:document.querySelectorAll("#upsell_ids option").length?"Yes":"No",weight:null!==(v=document.querySelector("#_weight"))&&void 0!==v&&v.value?"Yes":"No"}},a=function(){var e,t,o,c,n;let r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";const l=null===(e=document.querySelector(`#${r}mm`))||void 0===e?void 0:e.value,d=null===(t=document.querySelector(`#${r}jj`))||void 0===t?void 0:t.value,i=null===(o=document.querySelector(`#${r}aa`))||void 0===o?void 0:o.value,u=null===(c=document.querySelector(`#${r}hh`))||void 0===c?void 0:c.value,a=null===(n=document.querySelector(`#${r}mn`))||void 0===n?void 0:n.value;return`${l}-${d}-${i} ${u}:${a}`},s=()=>{var e,t,o,c;return{status:null===(e=document.querySelector("#post_status"))||void 0===e?void 0:e.value,visibility:null===(t=document.querySelector('input[name="visibility"]:checked'))||void 0===t?void 0:t.value,date:a()!==a("hidden_")?"yes":"no",catalog_visibility:null===(o=document.querySelector('input[name="_visibility"]:checked'))||void 0===o?void 0:o.value,featured:null===(c=document.querySelector("#_featured"))||void 0===c?void 0:c.checked}},v=(e,t)=>Object.fromEntries(Object.entries(e).map((e=>{let[o,c]=e;return[`${t}${o}`,c]}))),_=()=>{var e,c,n,r,l,d,i,a,_,m;const p=s();function g(e){var o;(0,t.recordEvent)("product_tags_delete",{page:"product",tag_list_size:(null===(o=document.querySelector(".tagchecklist"))||void 0===o?void 0:o.children.length)||0})}function y(){document.querySelectorAll("#product_tag .ntdelbutton").forEach((e=>{e.removeEventListener("click",g),e.addEventListener("click",g)}))}function h(e){var o,c;(0,t.recordEvent)("product_tags_add",{page:"product",tag_string_length:null===(o=e.target.textContent)||void 0===o?void 0:o.length,tag_list_size:(null===(c=document.querySelector(".tagchecklist"))||void 0===c?void 0:c.children.length)||0,most_used:!0}),y()}function S(){document.querySelectorAll("#tagcloud-product_tag .tag-cloud-link").forEach((e=>{e.removeEventListener("click",h),e.addEventListener("click",h)}))}function w(){(0,t.recordEvent)("product_attributes_add_term",{page:"product"})}function k(){document.querySelectorAll(".woocommerce_attribute .add_new_attribute").forEach((e=>{e.removeEventListener("click",w),e.addEventListener("click",w)}))}null===(e=document.querySelector("#post-preview"))||void 0===e||e.addEventListener("click",(()=>{(0,t.recordEvent)("product_preview_changes")})),null===(c=document.querySelector(".submitduplicate"))||void 0===c||c.addEventListener("click",(()=>{(0,t.recordEvent)("product_copy",u())})),null===(n=document.querySelector(".submitdelete"))||void 0===n||n.addEventListener("click",(()=>{(0,t.recordEvent)("product_delete",u())})),document.querySelectorAll(".edit-post-status, .edit-visibility, .edit-timestamp, .edit-catalog-visibility").forEach((e=>{e.addEventListener("click",(()=>{(0,t.recordEvent)("product_publish_widget_edit",{...s(),...u()})}))})),document.querySelectorAll(".save-post-status, .save-post-visibility, .save-timestamp, .save-post-visibility").forEach((e=>{e.addEventListener("click",(()=>{(0,t.recordEvent)("product_publish_widget_save",{...v(s(),"new_"),...v(p,"current_"),...u()})}))})),document.querySelectorAll(".handle-order-lower, .handle-order-higher").forEach((e=>{e.addEventListener("click",(e=>{const o=e.target.closest(".postbox");o&&(0,t.recordEvent)("product_widget_order_change",{widget:o.id})}))})),null===(r=document.querySelector("#show-settings-link"))||void 0===r||r.addEventListener("click",(()=>{(0,t.recordEvent)("product_screen_options_open")})),document.querySelectorAll("#adv-settings .metabox-prefs input[type=checkbox]").forEach((e=>{e.addEventListener("change",(()=>{(0,t.recordEvent)("product_screen_elements",{selected_element:e.value,checkbox:e.checked})}))})),document.querySelectorAll('input[name="screen_columns"]').forEach((e=>{e.addEventListener("change",(()=>{(0,t.recordEvent)("product_layout",{selected_layout:e.value})}))})),null===(l=document.querySelector("#editor-expand-toggle"))||void 0===l||l.addEventListener("change",(e=>{(0,t.recordEvent)("product_additional_settings",{checkbox:e.target.checked})})),o("#product_tag .tagchecklist",y),null===(d=document.querySelector(".tagadd"))||void 0===d||d.addEventListener("click",(e=>{const o=document.querySelector("#new-tag-product_tag");var c;o&&o.value&&o.value.length>0&&((0,t.recordEvent)("product_tags_add",{page:"product",tag_string_length:o.value.length,tag_list_size:((null===(c=document.querySelector(".tagchecklist"))||void 0===c?void 0:c.children.length)||0)+1,most_used:!1}),setTimeout((()=>{y()}),500))})),null===(i=document.querySelector(".tagcloud-link"))||void 0===i||i.addEventListener("click",(()=>{o("#tagcloud-product_tag",S)})),k(),null===(a=document.querySelector(".add_attribute"))||void 0===a||a.addEventListener("click",(()=>{setTimeout((()=>{k()}),1e3)}));const q=document.querySelectorAll(".woocommerce_attribute").length;null===(_=document.querySelector(".save_attributes"))||void 0===_||_.addEventListener("click",(()=>{document.querySelectorAll(".woocommerce_attribute").length>q&&(0,t.recordEvent)("product_attributes_add",{page:"product",enable_archive:"",default_sort_order:""})})),null===(m=document.querySelector("#woocommerce-product-updated-message-view-product__link"))||void 0===m||m.addEventListener("click",(()=>{(0,t.recordEvent)("product_view_product_click",u())}));const E=".notice-success.is-dismissible > button";o(E,(()=>{var e;null===(e=document.querySelector(E))||void 0===e||e.addEventListener("click",(()=>{(0,t.recordEvent)("product_view_product_dismiss",u())}))}))};function m(e){let t=!1,o=!1;const c=document.querySelector("#submitpost a.submitdelete");c&&c.addEventListener("click",(function(){o=!0})),window.addEventListener("beforeunload",(function(e){if(function(){const e=['#submitpost [type="submit"]',"#submitpost #post-preview"];let t=!1;for(const o of e)document.querySelectorAll(o).forEach((e=>{e.classList.contains("disabled")&&(t=!0)}));return t}()||o)return t=!1,void(o=!1);const c=window.tinymce&&window.tinymce.get("content");window.wp.autosave?t=window.wp.autosave.server.postChanged():c&&(t=!c.isHidden()&&c.isDirty())})),i(e,(()=>t))}productScreen&&"edit"===productScreen.name&&((0,t.recordEvent)("product_edit_view"),_(),m("product_edit_view")),productScreen&&"new"===productScreen.name&&((0,t.recordEvent)("product_add_view"),_(),m("product_add_view")),(window.wc=window.wc||{}).productTracking=e}();