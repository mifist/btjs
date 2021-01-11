'use strict';

/**
* Helper Functions
*/
const clickEvent = ( selector, func ) => {
	let	selectorLength = selector.length;
	while (selectorLength--)
		selector[selectorLength].addEventListener("click", ( event ) => {
			func( event )
		} );
};
const productEvent = ( event ) => {
	let _target = event.target,
		parentBox = _target.closest('.product-box__item'),
		parent = _target.parentNode,
		qty = parent.querySelector('.qty__item'),
		qtyVal = qty.value,
		price = parentBox.dataset.price,
		cartInfo = document.getElementsByClassName('top-cart-info__item'),
		cartInfoVal = document.querySelectorAll('.red-info');

	// added product total quantity to Cart Info Bar
	let defaultValQty = cartInfoVal[0].innerText === 'XXX' ? 0 : parseInt(cartInfoVal[0].innerText);
	cartInfoVal[0].innerHTML = defaultValQty + parseInt(qtyVal);
	
	// added product total price to Cart Info Bar
	let defaultValPrice = cartInfoVal[1].innerText === 'XXX' ? 0 : parseInt(cartInfoVal[1].innerText);
	cartInfoVal[1].innerHTML = defaultValPrice + parseInt(price)*parseInt(qtyVal);
	
};
// modal events
const modalOpen = () => {
	document.getElementsByClassName('cart-modal__wrap')[0].style.display = 'block';
};
const modalClose = () => {
	document.getElementsByClassName('cart-modal__wrap')[0].style.display = 'none';
};
// checkout events
const checkoutEvent = ( event ) => {
	let _target = event.target;
	modalOpen();
};
const isValidForm = () => {
	let isValid = false,
		input = document.querySelectorAll('.form-input');
	input.forEach( (element, index) => {
		if ( input[index].value.length > 0 && input[index].value.indexOf(' ') !== 0 ) {
			isValid = true;
			input[index].parentNode.querySelector('.error-msg').style.display = 'none';
		} else {
			isValid = false;
			input[index].parentNode.querySelector('.error-msg').style.display = 'block';
		}
	} );
	isValid ? isConfirmMsg() : '';
	return isValid;
};

const isConfirmMsg = () => {
	alert('Спасибо за вашу покупку! Мы свяжемся с вами в ближайшее время!');
	document.querySelectorAll('.red-info').forEach( (element, index) => {
		element.innerHTML = 'XXX';
	} );
};
// Filtering
const productFiltering = ( event ) => {
	
	let _target = event.target,
		value = _target.value,
		type = _target.dataset.type;
	const product = document.querySelectorAll('.product-box__item');

	if ( type === 'category'  ) {
		localStorage.setItem('category', parseInt(value));
	} else if ( type === 'price' ) {
		localStorage.setItem('price', parseInt(value));
	}
	
	product.forEach( (element, index, array) => {
		let category = parseInt(product[index].dataset.category),
			price = parseInt(product[index].dataset.price);
	
		product[index].style.display = 'flex';
		
	
		if ( localStorage.getItem( 'price' )==0 && localStorage.getItem( 'category' )==0 )  {
			product[index].style.display = 'flex';
		} else if ( localStorage.getItem( 'category' )==0 && localStorage.getItem( 'price' )!=0  ) {
			if ( price <= localStorage.getItem( 'price' ) ) {
				product[index].style.display = 'flex';
			} else {
				product[index].style.display = 'none';
			}
		} else if ( localStorage.getItem( 'category' )!=0 && localStorage.getItem( 'price' )==0  ) {
			if ( category == localStorage.getItem( 'category' ) ) {
				product[index].style.display = 'flex';
			} else  {
				product[index].style.display = 'none';
			}
		} else {
			if ( price <= localStorage.getItem( 'price' ) && category == localStorage.getItem( 'category' ) ) {
				product[index].style.display = 'flex';
			} else if ( price <= localStorage.getItem( 'price' ) && category != localStorage.getItem( 'category' ) ) {
				product[index].style.display = 'none';
			} else if ( price >= localStorage.getItem( 'price' ) && category == localStorage.getItem( 'category' ) ) {
				product[index].style.display = 'none';
			} else if ( price >= localStorage.getItem( 'price' ) && category != localStorage.getItem( 'category' ) ) {
				product[index].style.display = 'none';
			}
		}
		
	} );

	
};


/**
 * Add Event for Product add to Cart
 */
const productBtn = document.getElementsByClassName('product-box__btn');
clickEvent(productBtn, productEvent);

/**
* Add Event for Checkout
*/
const checkoutBtn = document.getElementsByClassName('btn-check');
const modalCloseBtn = document.getElementsByClassName('cart-modal__close');
clickEvent(modalCloseBtn, modalClose);
clickEvent(checkoutBtn, checkoutEvent);
document.getElementById('cart-modal-form').onsubmit = ( event ) => {
	event.preventDefault();
	return isValidForm() ? isConfirmMsg() : isValidForm();
};

/**
 * Add Event for Product filtering
 */
const filterSelects = document.querySelectorAll('.select-control');
localStorage.setItem('category', 0);
localStorage.setItem('price', 0);
filterSelects.forEach( (element, index) => {
	filterSelects[index].addEventListener("change", ( event ) => {
		productFiltering( event )
	} );
} );