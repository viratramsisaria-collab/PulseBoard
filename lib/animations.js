"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* =========================================================
   EASINGS
========================================================= */

export const easings = {
  smooth: "power3.out",
  smoothIn: "power3.in",
  smoothInOut: "power3.inOut",

  expo: "expo.out",
  expoInOut: "expo.inOut",

  back: "back.out(1.7)",
  backSoft: "back.out(1.2)",

  elastic: "elastic.out(1, 0.5)",

  circ: "circ.out",
  circInOut: "circ.inOut",
};

/* =========================================================
   FRAMER MOTION VARIANTS
========================================================= */

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeDown = {
  hidden: {
    opacity: 0,
    y: -30,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -40,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeRight = {
  hidden: {
    opacity: 0,
    x: 40,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.88,
    filter: "blur(10px)",
  },

  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const popIn = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    y: 10,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 24,
      mass: 0.7,
    },
  },
};

export const blurReveal = {
  hidden: {
    opacity: 0,
    filter: "blur(20px)",
    scale: 1.04,
  },

  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* =========================================================
   STAGGER SYSTEMS
========================================================= */

export const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const fastStagger = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.045,
    },
  },
};

export const slowStagger = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.15,
    },
  },
};

/* =========================================================
   CARD MOTION
========================================================= */

export const cardHover = {
  rest: {
    y: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
  },

  hover: {
    y: -7,
    scale: 1.015,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};

export const taskHover = {
  rest: {
    scale: 1,
    y: 0,
  },

  hover: {
    scale: 1.02,
    y: -3,
    transition: {
      duration: 0.2,
      ease: easings.smooth,
    },
  },

  tap: {
    scale: 0.97,
  },
};

/* =========================================================
   PAGE ENTER
========================================================= */

export function pageEnter(element) {
  if (!element) return;

  const tl = gsap.timeline();

  tl.fromTo(
    element,
    {
      opacity: 0,
      y: 30,
      filter: "blur(12px)",
    },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.8,
      ease: easings.expo,
    }
  );

  return tl;
}

/* =========================================================
   HERO REVEAL
========================================================= */

export function heroReveal(container) {
  if (!container) return;

  const title = container.querySelector("[data-hero-title]");
  const subtitle = container.querySelector("[data-hero-subtitle]");
  const actions = container.querySelector("[data-hero-actions]");

  const tl = gsap.timeline();

  if (title) {
    tl.fromTo(
      title,
      {
        opacity: 0,
        y: 70,
        rotateX: -25,
        transformPerspective: 1000,
        filter: "blur(12px)",
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: easings.expo,
      }
    );
  }

  if (subtitle) {
    tl.fromTo(
      subtitle,
      {
        opacity: 0,
        y: 30,
        filter: "blur(8px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: easings.smooth,
      },
      "-=0.6"
    );
  }

  if (actions) {
    tl.fromTo(
      actions.children,
      {
        opacity: 0,
        y: 20,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: easings.backSoft,
      },
      "-=0.4"
    );
  }

  return tl;
}

/* =========================================================
   SCROLL REVEAL
========================================================= */

export function scrollReveal(elements) {
  if (!elements) return;

  const items = gsap.utils.toArray(elements);

  items.forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 60,
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: easings.expo,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          once: true,
        },
      }
    );
  });
}

/* =========================================================
   STAGGER REVEAL
========================================================= */

export function staggerReveal(container, selector = "[data-reveal]") {
  if (!container) return;

  const elements = container.querySelectorAll(selector);

  if (!elements.length) return;

  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 35,
      scale: 0.96,
      filter: "blur(8px)",
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.65,
      stagger: 0.075,
      ease: easings.expo,
    }
  );
}

/* =========================================================
   PARALLAX
========================================================= */

export function createParallax(element, amount = 80) {
  if (!element) return;

  return gsap.to(element, {
    y: amount,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}

/* =========================================================
   MAGNETIC BUTTON
========================================================= */

export function magnetic(element, strength = 0.25) {
  if (!element) return;

  const move = (event) => {
    const rect = element.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left -
      rect.width / 2;

    const y =
      event.clientY -
      rect.top -
      rect.height / 2;

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: easings.smooth,
    });
  };

  const reset = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: easings.elastic,
    });
  };

  element.addEventListener("mousemove", move);
  element.addEventListener("mouseleave", reset);

  return () => {
    element.removeEventListener("mousemove", move);
    element.removeEventListener("mouseleave", reset);
  };
}

/* =========================================================
   TILT CARD
========================================================= */

export function tiltCard(element, intensity = 8) {
  if (!element) return;

  const move = (event) => {
    const rect = element.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width;

    const y =
      (event.clientY - rect.top) /
      rect.height;

    const rotateY =
      (x - 0.5) * intensity;

    const rotateX =
      (0.5 - y) * intensity;

    gsap.to(element, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.4,
      ease: easings.smooth,
    });
  };

  const reset = () => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: easings.elastic,
    });
  };

  element.addEventListener("mousemove", move);
  element.addEventListener("mouseleave", reset);

  return () => {
    element.removeEventListener("mousemove", move);
    element.removeEventListener("mouseleave", reset);
  };
}

/* =========================================================
   RIPPLE
========================================================= */

export function ripple(element, event) {
  if (!element) return;

  const rect = element.getBoundingClientRect();

  const ripple = document.createElement("span");

  const size = Math.max(
    rect.width,
    rect.height
  );

  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;

  ripple.style.position = "absolute";
  ripple.style.borderRadius = "9999px";
  ripple.style.pointerEvents = "none";
  ripple.style.background = "currentColor";
  ripple.style.opacity = "0.12";

  ripple.style.left = `${
    event.clientX - rect.left - size / 2
  }px`;

  ripple.style.top = `${
    event.clientY - rect.top - size / 2
  }px`;

  element.appendChild(ripple);

  gsap.fromTo(
    ripple,
    {
      scale: 0,
      opacity: 0.18,
    },
    {
      scale: 1,
      opacity: 0,
      duration: 0.65,
      ease: easings.smooth,
      onComplete: () => ripple.remove(),
    }
  );
}

/* =========================================================
   SOCKET EVENT PULSE
========================================================= */

export function socketPulse(element) {
  if (!element) return;

  return gsap.timeline()
    .to(element, {
      scale: 1.04,
      duration: 0.15,
      ease: easings.smooth,
    })
    .to(element, {
      scale: 1,
      duration: 0.35,
      ease: easings.elastic,
    });
}

/* =========================================================
   NEW MESSAGE ANIMATION
========================================================= */

export function animateNewMessage(element) {
  if (!element) return;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 25,
      scale: 0.94,
      filter: "blur(8px)",
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.5,
      ease: easings.backSoft,
    }
  );
}

/* =========================================================
   TASK MOVE
========================================================= */

export function animateTaskMove(element) {
  if (!element) return;

  return gsap.timeline()
    .to(element, {
      scale: 1.05,
      rotate: 1,
      duration: 0.15,
      ease: easings.smooth,
    })
    .to(element, {
      scale: 1,
      rotate: 0,
      duration: 0.4,
      ease: easings.elastic,
    });
}

/* =========================================================
   TASK CREATE
========================================================= */

export function animateTaskCreate(element) {
  if (!element) return;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.7,
      y: 30,
      rotateX: -15,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      duration: 0.65,
      ease: easings.back,
    }
  );
}

/* =========================================================
   TASK DELETE
========================================================= */

export function animateTaskDelete(element) {
  if (!element) return;

  return gsap.to(element, {
    opacity: 0,
    x: 80,
    scale: 0.8,
    height: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    duration: 0.4,
    ease: easings.expoInOut,
  });
}

/* =========================================================
   PRESENCE JOIN
========================================================= */

export function animatePresenceJoin(element) {
  if (!element) return;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0,
      x: -15,
    },
    {
      opacity: 1,
      scale: 1,
      x: 0,
      duration: 0.55,
      ease: easings.elastic,
    }
  );
}

/* =========================================================
   PRESENCE LEAVE
========================================================= */

export function animatePresenceLeave(element) {
  if (!element) return;

  return gsap.to(element, {
    opacity: 0,
    scale: 0,
    x: 15,
    duration: 0.3,
    ease: easings.smoothIn,
  });
}

/* =========================================================
   NOTIFICATION
========================================================= */

export function notificationEnter(element) {
  if (!element) return;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      x: 80,
      scale: 0.9,
      filter: "blur(8px)",
    },
    {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.6,
      ease: easings.backSoft,
    }
  );
}

/* =========================================================
   MODAL ENTER
========================================================= */

export function modalEnter(element) {
  if (!element) return;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.88,
      y: 30,
      filter: "blur(10px)",
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.5,
      ease: easings.backSoft,
    }
  );
}

/* =========================================================
   MODAL EXIT
========================================================= */

export function modalExit(element) {
  if (!element) return;

  return gsap.to(element, {
    opacity: 0,
    scale: 0.94,
    y: 15,
    filter: "blur(8px)",
    duration: 0.25,
    ease: easings.smoothIn,
  });
}

/* =========================================================
   SIDEBAR
========================================================= */

export function sidebarEnter(element) {
  if (!element) return;

  return gsap.fromTo(
    element,
    {
      x: -40,
      opacity: 0,
    },
    {
      x: 0,
      opacity: 1,
      duration: 0.65,
      ease: easings.expo,
    }
  );
}

/* =========================================================
   DASHBOARD LOAD
========================================================= */

export function dashboardReveal(container) {
  if (!container) return;

  const tl = gsap.timeline();

  const header = container.querySelector(
    "[data-dashboard-header]"
  );

  const cards = container.querySelectorAll(
    "[data-dashboard-card]"
  );

  const sections = container.querySelectorAll(
    "[data-dashboard-section]"
  );

  if (header) {
    tl.fromTo(
      header,
      {
        opacity: 0,
        y: 35,
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: easings.expo,
      }
    );
  }

  if (cards.length) {
    tl.fromTo(
      cards,
      {
        opacity: 0,
        y: 35,
        scale: 0.94,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: easings.backSoft,
      },
      "-=0.4"
    );
  }

  if (sections.length) {
    tl.fromTo(
      sections,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: easings.expo,
      },
      "-=0.35"
    );
  }

  return tl;
}

/* =========================================================
   CLEANUP
========================================================= */

export function killAnimations() {
  if (typeof window === "undefined") return;

  gsap.killTweensOf("*");
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill();
  });
}