<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	// Cursor refs
	let customCursor: SVGSVGElement | null = null;
	let computerBackground: SVGGElement | null = null;

	let sunRotationDirection = 1;

	// Shake control constants
	const DEFAULT_SHAKE_INTENSITY = 5;
	const DEFAULT_SHAKE_SPEED = 0.5;
	let shakeIntensity = 3;
	let shakeSpeed = 0.8;
	let numPlantClicks = 0;
	let isShaking = false;

	const sunOrbit = {
		rotation: 360 * sunRotationDirection,
		duration: 30,
		repeat: -1,
		ease: 'none',
		transformOrigin: '-18px 180px'
	};

	function handleSunClick() {
		sunRotationDirection *= -1; // Flip the direction
		gsap.to('.sun', {
			rotation: 360 * sunRotationDirection,
			duration: 30,
			repeat: -1,
			ease: 'none',
			transformOrigin: '-18px 180px'
		});
	}

	const swayAnimation = {
		rotation: 5,
		duration: 5,
		repeat: -1,
		yoyo: true,
		ease: 'power1.inOut',
		transformOrigin: 'bottom center'
	};

	// function handleMouseMove(event: MouseEvent) {
	// 	if (!customCursor || !computerBackground) return;

	// 	const rect = computerBackground.getBoundingClientRect();
	// 	const x = event.clientX - rect.left + 197;
	// 	const y = event.clientY - rect.top + 32;

	// 	gsap.to(customCursor, {
	// 		x: x,
	// 		y: y,
	// 		duration: 0.1,
	// 		ease: 'power1.out'
	// 	});
	// }

	function handleMouseMove(event: MouseEvent) {
		if (!customCursor || !computerBackground) return;

		const rect = computerBackground.getBoundingClientRect();
		let scale = 1;

		// Determine scale based on screen size
		if (window.innerWidth >= 1536) {
			// 2xl breakpoint
			scale = 0.5;
		} else if (window.innerWidth >= 1280) {
			// xl breakpoint
			scale = 0.5;
		} else if (window.innerWidth >= 1024) {
			// lg breakpoint
			scale = 0.75;
		}

		const offset = 10 * scale; // Adjust offset based on scale
		const x = event.clientX - rect.left - offset + 80 * scale;
		const y = event.clientY - rect.top - offset + 80 * scale;

		gsap.to(customCursor, {
			x: x,
			y: y,
			duration: 0.1,
			ease: 'power1.out'
		});
	}

	function handleMouseEnter() {
		gsap.to(customCursor, {
			opacity: 1,
			duration: 0.2,
			ease: 'power2.in'
		});
	}

	function handleMouseLeave() {
		gsap.to(customCursor, {
			opacity: 0,
			duration: 0.2,
			ease: 'power2.in'
		});
	}

	function handlePlantClick() {
		if (!isShaking) {
			if (numPlantClicks >= 6) {
				numPlantClicks = 0;
				shakeIntensity = DEFAULT_SHAKE_INTENSITY;
				shakeSpeed = DEFAULT_SHAKE_SPEED;
			}

			shakeIntensity += 2;
			shakeSpeed -= 0.01;
			numPlantClicks++;

			isShaking = true;
			gsap.killTweensOf('.plant');

			const tl = gsap.timeline({
				onComplete: () => {
					isShaking = false;
					gsap.to('.plant', swayAnimation);
				}
			});

			tl.to('.plant', {
				rotation: -shakeIntensity,
				duration: shakeSpeed,
				ease: 'power1.inOut',
				transformOrigin: 'bottom center'
			})
				.to('.plant', {
					rotation: shakeIntensity,
					duration: shakeSpeed,
					ease: 'power1.inOut'
				})
				.to('.plant', {
					rotation: -shakeIntensity * 0.67,
					duration: shakeSpeed,
					ease: 'power1.inOut'
				})
				.to('.plant', {
					rotation: shakeIntensity * 0.67,
					duration: shakeSpeed,
					ease: 'power1.inOut'
				})
				.to('.plant', {
					rotation: 0,
					duration: shakeSpeed,
					ease: 'power1.inOut'
				});
		}
	}

	onMount(() => {
		gsap.to('.sun', sunOrbit);
		gsap.to('.plant', swayAnimation);
	});
</script>

<svg
	bind:this={customCursor}
	class="pointer-events-none absolute z-50 w-[5vw] opacity-0 lg:w-[2vw]"
	width="30"
	height="30"
	viewBox="0 0 30 30"
	style="transform: translate(0px, 0px);"
>
	<path
		d="M0.816859 4.66021L8.11956 27.4109C8.96566 30.0469 12.6262 30.2278 13.7281 27.6882L17.2271 19.624C17.5765 18.8187 18.2612 18.2068 19.1006 17.9497L29.0862 14.8914C31.8732 14.0378 31.9287 10.1124 29.1669 9.18039L4.63257 0.900816C2.29994 0.113626 0.0644398 2.31614 0.816859 4.66021Z"
		class="fill-zinc-950"
	/>
</svg>

<div>
	<svg
		width="100%"
		height="100%"
		preserveAspectRatio="xMidYMid meet"
		viewBox="0 0 546 567"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g filter="url(#filter0_d_94_156)">
			<rect x="4" width="537.152" height="500.3" rx="20" fill="#F7F6EF" />
		</g>
		<rect x="31.5469" y="20.4219" width="41.3194" height="433.934" fill="#C6BDB7" />
		<rect x="31.5469" y="20.4219" width="482.06" height="25.5255" fill="#C6BDB7" />
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<g
			bind:this={computerBackground as any}
			on:mousemove={handleMouseMove}
			on:mouseenter={handleMouseEnter}
			on:mouseleave={handleMouseLeave}
		>
			<path
				style="cursor: none"
				d="M72.6113 47.0457C96.4658 21.8957 447.488 23.8867 482.964 47.0434C518.44 70.2 486.456 401.118 489.516 433.708C492.577 466.297 102.978 457.099 72.6119 428.316C42.2457 399.533 48.7567 72.1957 72.6113 47.0457Z"
				class="fill-one computer-background"
			/>

			<ellipse
				on:click={handleSunClick}
				cx="371.714"
				cy="134.843"
				rx="80"
				ry="80"
				class="fill-three sun"
			/>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<path
				d="M131.992 355.955L129.977 359.759C127.197 365.008 125.744 370.863 125.744 376.802C125.744 384.218 128.011 391.464 132.243 397.555C137.039 404.458 144.079 409.487 152.165 411.784L156.027 412.882C161.711 414.497 167.645 415.039 173.527 414.481L187.022 413.201C195.5 412.397 203.787 410.199 211.55 406.696C220.303 402.746 228.244 397.202 234.968 390.346L237.291 387.977C243.93 381.209 249.518 373.485 253.872 365.063L263.268 346.887L275.043 318.872C276.196 316.131 277.561 313.484 279.127 310.956L285.211 301.134C286.121 299.664 287.379 298.441 288.872 297.571L290.353 296.708C293.264 295.012 296.922 295.299 299.533 297.429C300.709 298.387 301.591 299.658 302.079 301.094L303.319 304.748C304.434 308.032 304.739 311.535 304.208 314.962L301.332 333.533L298.582 346.619C296.338 357.293 295.903 368.269 297.295 379.087L298.004 384.597C298.312 386.994 298.845 389.356 299.596 391.653L301.249 396.709C303.643 404.032 309.077 409.97 316.16 413.003L318.723 414.101C323.077 415.965 327.963 416.174 332.461 414.686C337.66 412.967 341.891 409.132 344.112 404.127L345.306 401.435C347.327 396.881 348 391.842 347.245 386.917L345.607 376.224C344.745 370.602 343.126 365.122 340.794 359.935L330.802 337.706L322.206 309.746L316.656 295.451C315.372 292.143 316.672 288.391 319.728 286.588C321.32 285.648 323.21 285.352 325.013 285.761L327.658 286.36C331.247 287.173 334.375 289.36 336.372 292.451L342.047 301.237C343.55 303.565 344.806 306.043 345.794 308.633L355.769 334.785L361.413 345.801C367.125 356.95 375.305 366.648 385.331 374.158L386.231 374.832C388.84 376.786 391.588 378.548 394.453 380.102L401.463 383.903C406.663 386.723 412.485 388.2 418.4 388.2H419.717C426.813 388.2 433.705 385.82 439.288 381.441C444.083 377.681 447.693 372.619 449.686 366.861L450.148 365.526C452.652 358.291 452.819 350.451 450.624 343.116L449.394 339.007C447.57 332.91 444.595 327.219 440.629 322.243L438.885 320.054C433.465 313.253 426.721 307.622 419.061 303.503L404.808 295.838C397.234 291.764 389.308 288.381 381.127 285.73L340.625 272.605L314.275 263.342C308.221 261.213 302.875 257.448 298.83 252.466L296.592 249.708C295.665 248.567 294.934 247.28 294.426 245.9L294.073 244.939C292.507 240.682 293.534 235.905 296.709 232.667C297.868 231.485 299.264 230.562 300.804 229.958L304.636 228.455C310.987 225.965 317.983 225.64 324.537 227.531L336.122 230.874L358.224 235.465L387.694 244.228L405.72 246.94C410.318 247.632 414.997 247.587 419.581 246.808L425.037 245.881C431.332 244.811 437.075 241.627 441.317 236.854C444.792 232.946 447.107 228.132 447.999 222.979C449.461 214.531 447.002 205.857 441.312 199.444L441.08 199.184C436.977 194.56 431.5 191.373 425.452 190.091L408.809 186.563C398.648 184.409 388.167 184.239 377.942 186.064L360.343 189.204C349.677 191.107 339.215 194.012 329.095 197.881L321.688 200.713C306.267 206.61 291.635 214.392 278.127 223.885L268.179 230.874L248.967 241.15C245.343 243.089 241.019 243.212 237.29 241.484C232.665 239.34 229.705 234.706 229.705 229.609V224.273C229.705 220.138 230.901 216.091 233.148 212.62L237.761 205.493C241.359 199.934 246.022 195.143 251.481 191.394L263.268 183.301L291.509 164.94L317.433 148.062C322.782 144.579 327.735 140.523 332.205 135.966L343.616 124.332C348.861 118.984 352.324 112.147 353.533 104.755L353.903 102.488C355.105 95.1383 353.558 87.6032 349.558 81.3208C343.994 72.5811 334.351 67.2891 323.991 67.2891H316.291C308.892 67.2891 301.611 69.1408 295.11 72.6755L285.341 77.9879C274.037 84.1346 264.218 92.6834 256.573 103.033L253.355 107.389C246.632 116.492 241.32 126.558 237.6 137.246L232.016 153.292C230.478 157.711 229.322 162.252 228.559 166.868L224.382 192.154C223.596 196.915 220.99 201.183 217.114 204.057L213.499 206.737C211.076 208.534 207.948 209.086 205.056 208.226C201.814 207.261 199.32 204.66 198.492 201.38L197.077 195.769C196.46 193.322 196.317 190.78 196.657 188.279L198.632 173.738C199.427 167.885 200.762 162.118 202.621 156.511L208.113 139.945C209.136 136.86 209.932 133.703 210.494 130.502L211.906 122.468C213.624 112.685 211.945 102.609 207.147 93.9117L205.074 90.1537C201.676 83.9945 196.296 79.1645 189.807 76.4474L188.262 75.8001C181.038 72.775 172.865 72.9785 165.801 76.3595C160.017 79.1275 155.384 83.8325 152.705 89.6585L149.203 97.2763C146.151 103.914 144.571 111.133 144.571 118.439V129.94C144.571 141.778 146.608 153.528 150.592 164.676L153.249 172.108C159.151 188.621 167.926 203.96 179.169 217.417L190.413 230.874L202.625 244.308C204.816 246.719 206.353 249.65 207.09 252.823L207.837 256.037C208.954 260.849 207.357 265.887 203.67 269.176C201.195 271.385 197.993 272.605 194.675 272.605H191.926C188.514 272.605 185.155 271.763 182.147 270.153L178.409 268.152C173.118 265.32 168.581 261.263 165.177 256.32L161.978 251.674C158.587 246.75 156.107 241.258 154.654 235.459L153.676 231.551C152.532 226.983 150.394 222.724 147.414 219.079L145.82 217.129C141.854 212.276 136.234 209.06 130.04 208.099C124.095 207.177 118.015 208.394 112.883 211.533L110.698 212.87C105.294 216.176 100.978 220.994 98.2833 226.727L97.6997 227.969C94.6335 234.493 93.5413 241.771 94.5574 248.908L94.916 251.426C96.0729 259.552 99.4065 267.213 104.564 273.598L106.425 275.902C111.337 281.984 117.463 286.974 124.413 290.555L134.945 295.982C146.112 301.736 158.493 304.738 171.056 304.738C177.389 304.738 183.698 303.975 189.849 302.466L224.794 293.888L242.508 286.992C245.678 285.758 249.05 285.125 252.452 285.125H260.067C262.123 285.125 264.103 285.906 265.606 287.31C267.247 288.844 268.179 290.99 268.179 293.237V294.706C268.179 297.412 267.224 300.032 265.483 302.103L265.377 302.23C263.996 303.872 262.199 305.112 260.174 305.82L242.457 312.013C237.244 313.835 231.857 315.115 226.382 315.833L205.966 318.51L180.59 322.683L170.108 325.815C161.366 328.427 153.265 332.836 146.323 338.758L144.601 340.227C139.444 344.627 135.165 349.963 131.992 355.955Z"
				class="fill-background plant"
				on:click={handlePlantClick}
			/>
		</g>
		<line
			y1="-0.5"
			x2="52.3929"
			y2="-0.5"
			transform="matrix(-0.854365 0.519674 -0.52853 -0.848914 72.8652 428.836)"
			stroke="#ECEBE5"
		/>
		<path d="M82.3342 458.616L28.1025 456.064L72.8652 429.688L82.3342 458.616Z" fill="#F7F6EF" />
		<path d="M514.468 19.5703L480.896 45.9467L515.328 49.3501L514.468 19.5703Z" fill="#F7F6EF" />
		<path
			d="M229.394 564.738L197.317 556.349C177.644 551.204 169.507 527.723 181.778 511.507C187.174 504.377 195.598 500.188 204.54 500.188H347.039C356.737 500.188 365.775 505.098 371.053 513.234C381.494 529.331 373.451 550.942 355.026 556.296L327.156 564.395C322.605 565.717 317.889 566.389 313.15 566.389H242.227C237.896 566.389 233.584 565.834 229.394 564.738Z"
			fill="#F7F6EF"
		/>
	</svg>
</div>

<style>
	/* Hide the actual cursor when over the computer background */
	.computer-background {
		cursor: none;
	}
	.plant {
		cursor: none;
	}
	.sun {
		cursor: none;
	}
</style>
