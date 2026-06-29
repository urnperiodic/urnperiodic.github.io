import { useState, useEffect, useRef } from 'react';
import { games as gamesData } from './data/games';

// =============================================================================
// SLOPE-3 CLASSROOM6X CATALOG (1090 games)
// Auto-merged from https://github.com/slope-3-game/slope-3-game.github.io
// Each entry points to a local Classroom6x/class-N.html page and thumbnail/class-N.png.
// Both folders already exist in this repo (no extra asset uploads required).
// =============================================================================
const slopeClassroomGames = [
  {
    id: 'classroom6x-1',
    title: 'Zooplop',
    description: 'Zooplop - Classroom6x unblocked game',
    url: 'Classroom6x/class-1.html',
    thumbnail: 'thumbnail/class-1.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-2',
    title: 'World Conquest',
    description: 'World Conquest - Classroom6x unblocked game',
    url: 'Classroom6x/class-2.html',
    thumbnail: 'thumbnail/class-2.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-3',
    title: 'Toaster Dash',
    description: 'Toaster Dash - Classroom6x unblocked game',
    url: 'Classroom6x/class-3.html',
    thumbnail: 'thumbnail/class-3.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-4',
    title: 'Tank Ball: Monster Battle',
    description: 'Tank Ball: Monster Battle - Classroom6x unblocked game',
    url: 'Classroom6x/class-4.html',
    thumbnail: 'thumbnail/class-4.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-5',
    title: 'Sudoku Calendar',
    description: 'Sudoku Calendar - Classroom6x unblocked game',
    url: 'Classroom6x/class-5.html',
    thumbnail: 'thumbnail/class-5.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-6',
    title: 'Stickman Archero Fight',
    description: 'Stickman Archero Fight - Classroom6x unblocked game',
    url: 'Classroom6x/class-6.html',
    thumbnail: 'thumbnail/class-6.png',
    category: 'Stickman'
  },
  {
    id: 'classroom6x-8',
    title: 'Space Thing',
    description: 'Space Thing - Classroom6x unblocked game',
    url: 'Classroom6x/class-8.html',
    thumbnail: 'thumbnail/class-8.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-9',
    title: 'Snake Solver',
    description: 'Snake Solver - Classroom6x unblocked game',
    url: 'Classroom6x/class-9.html',
    thumbnail: 'thumbnail/class-9.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-10',
    title: 'Rush Race Motocross',
    description: 'Rush Race Motocross - Classroom6x unblocked game',
    url: 'Classroom6x/class-10.html',
    thumbnail: 'thumbnail/class-10.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-11',
    title: 'Rodeo Stampede Savannah',
    description: 'Rodeo Stampede Savannah - Classroom6x unblocked game',
    url: 'Classroom6x/class-11.html',
    thumbnail: 'thumbnail/class-11.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-12',
    title: 'Ragdoll Hit',
    description: 'Ragdoll Hit - Classroom6x unblocked game',
    url: 'Classroom6x/class-12.html',
    thumbnail: 'thumbnail/class-12.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-13',
    title: 'Puffy Cat',
    description: 'Puffy Cat - Classroom6x unblocked game',
    url: 'Classroom6x/class-13.html',
    thumbnail: 'thumbnail/class-13.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-14',
    title: 'OvO Dimensions',
    description: 'OvO Dimensions - Classroom6x unblocked game',
    url: 'Classroom6x/class-14.html',
    thumbnail: 'thumbnail/class-14.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-15',
    title: 'Ooze Odyssey',
    description: 'Ooze Odyssey - Classroom6x unblocked game',
    url: 'Classroom6x/class-15.html',
    thumbnail: 'thumbnail/class-15.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-16',
    title: 'Life Choices: Life Simulator',
    description: 'Life Choices: Life Simulator - Classroom6x unblocked game',
    url: 'Classroom6x/class-16.html',
    thumbnail: 'thumbnail/class-16.png',
    category: 'Simulation'
  },
  {
    id: 'classroom6x-17',
    title: 'Lava Bird',
    description: 'Lava Bird - Classroom6x unblocked game',
    url: 'Classroom6x/class-17.html',
    thumbnail: 'thumbnail/class-17.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-18',
    title: 'Jamming Car Escape',
    description: 'Jamming Car Escape - Classroom6x unblocked game',
    url: 'Classroom6x/class-18.html',
    thumbnail: 'thumbnail/class-18.png',
    category: '3D'
  },
  {
    id: 'classroom6x-19',
    title: 'Impossible Tic Tac Toe',
    description: 'Impossible Tic Tac Toe - Classroom6x unblocked game',
    url: 'Classroom6x/class-19.html',
    thumbnail: 'thumbnail/class-19.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-20',
    title: 'Iidle Cowshed',
    description: 'Iidle Cowshed - Classroom6x unblocked game',
    url: 'Classroom6x/class-20.html',
    thumbnail: 'thumbnail/class-20.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-21',
    title: 'Gobdun',
    description: 'Gobdun - Classroom6x unblocked game',
    url: 'Classroom6x/class-21.html',
    thumbnail: 'thumbnail/class-21.png',
    category: '3D'
  },
  {
    id: 'classroom6x-22',
    title: 'Fruit Ninja',
    description: 'Fruit Ninja - Classroom6x unblocked game',
    url: 'Classroom6x/class-22.html',
    thumbnail: 'thumbnail/class-22.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-23',
    title: 'Freefall Apart',
    description: 'Freefall Apart - Classroom6x unblocked game',
    url: 'Classroom6x/class-23.html',
    thumbnail: 'thumbnail/class-23.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-24',
    title: 'Driftwave',
    description: 'Driftwave - Classroom6x unblocked game',
    url: 'Classroom6x/class-24.html',
    thumbnail: 'thumbnail/class-24.png',
    category: '3D'
  },
  {
    id: 'classroom6x-25',
    title: 'Draw Pixel Art',
    description: 'Draw Pixel Art - Classroom6x unblocked game',
    url: 'Classroom6x/class-25.html',
    thumbnail: 'thumbnail/class-25.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-26',
    title: 'Digging Master',
    description: 'Digging Master - Classroom6x unblocked game',
    url: 'Classroom6x/class-26.html',
    thumbnail: 'thumbnail/class-26.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-27',
    title: 'Crown Guard',
    description: 'Crown Guard - Classroom6x unblocked game',
    url: 'Classroom6x/class-27.html',
    thumbnail: 'thumbnail/class-27.png',
    category: 'Strategy'
  },
  {
    id: 'classroom6x-28',
    title: 'Castle of Chaos',
    description: 'Castle of Chaos - Classroom6x unblocked game',
    url: 'Classroom6x/class-28.html',
    thumbnail: 'thumbnail/class-28.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-29',
    title: 'Bullet Bro',
    description: 'Bullet Bro - Classroom6x unblocked game',
    url: 'Classroom6x/class-29.html',
    thumbnail: 'thumbnail/class-29.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-30',
    title: 'Brain Test 4: Tricky Friends',
    description: 'Brain Test 4: Tricky Friends - Classroom6x unblocked game',
    url: 'Classroom6x/class-30.html',
    thumbnail: 'thumbnail/class-30.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-31',
    title: 'Bottle Flip',
    description: 'Bottle Flip - Classroom6x unblocked game',
    url: 'Classroom6x/class-31.html',
    thumbnail: 'thumbnail/class-31.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-32',
    title: 'Blob Drop',
    description: 'Blob Drop - Classroom6x unblocked game',
    url: 'Classroom6x/class-32.html',
    thumbnail: 'thumbnail/class-32.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-33',
    title: 'Bird Jumper',
    description: 'Bird Jumper - Classroom6x unblocked game',
    url: 'Classroom6x/class-33.html',
    thumbnail: 'thumbnail/class-33.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-34',
    title: 'A Pretty Odd Bunny: Roast it!',
    description: 'A Pretty Odd Bunny: Roast it! - Classroom6x unblocked game',
    url: 'Classroom6x/class-34.html',
    thumbnail: 'thumbnail/class-34.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-35',
    title: 'Pirates Merger',
    description: 'Pirates Merger - Classroom6x unblocked game',
    url: 'Classroom6x/class-35.html',
    thumbnail: 'thumbnail/class-35.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-36',
    title: 'Papas Pizzeria',
    description: 'Papas Pizzeria - Classroom6x unblocked game',
    url: 'Classroom6x/class-36.html',
    thumbnail: 'thumbnail/class-36.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-37',
    title: 'Papas Donuteria',
    description: 'Papas Donuteria - Classroom6x unblocked game',
    url: 'Classroom6x/class-37.html',
    thumbnail: 'thumbnail/class-37.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-38',
    title: 'Papas Pancakeria',
    description: 'Papas Pancakeria - Classroom6x unblocked game',
    url: 'Classroom6x/class-38.html',
    thumbnail: 'thumbnail/class-38.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-39',
    title: 'Papa Louie When Pizzas Attack',
    description: 'Papa Louie When Pizzas Attack - Classroom6x unblocked game',
    url: 'Classroom6x/class-39.html',
    thumbnail: 'thumbnail/class-39.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-40',
    title: 'Papas Taco Mia',
    description: 'Papas Taco Mia - Classroom6x unblocked game',
    url: 'Classroom6x/class-40.html',
    thumbnail: 'thumbnail/class-40.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-41',
    title: 'Papas Hotdoggeria',
    description: 'Papas Hotdoggeria - Classroom6x unblocked game',
    url: 'Classroom6x/class-41.html',
    thumbnail: 'thumbnail/class-41.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-42',
    title: 'Midnight Drive',
    description: 'Midnight Drive - Classroom6x unblocked game',
    url: 'Classroom6x/class-42.html',
    thumbnail: 'thumbnail/class-42.png',
    category: '3D'
  },
  {
    id: 'classroom6x-43',
    title: 'Thunderdogs io',
    description: 'Thunderdogs io - Classroom6x unblocked game',
    url: 'Classroom6x/class-43.html',
    thumbnail: 'thumbnail/class-43.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-44',
    title: 'Hop Chop',
    description: 'Hop Chop - Classroom6x unblocked game',
    url: 'Classroom6x/class-44.html',
    thumbnail: 'thumbnail/class-44.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-45',
    title: 'Goat vs Zombies',
    description: 'Goat vs Zombies - Classroom6x unblocked game',
    url: 'Classroom6x/class-45.html',
    thumbnail: 'thumbnail/class-45.png',
    category: '3D'
  },
  {
    id: 'classroom6x-46',
    title: 'Pond Rrace',
    description: 'Pond Rrace - Classroom6x unblocked game',
    url: 'Classroom6x/class-46.html',
    thumbnail: 'thumbnail/class-46.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-47',
    title: 'Grow Up The Cats',
    description: 'Grow Up The Cats - Classroom6x unblocked game',
    url: 'Classroom6x/class-47.html',
    thumbnail: 'thumbnail/class-47.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-49',
    title: 'Super Fowlst 2',
    description: 'Super Fowlst 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-49.html',
    thumbnail: 'thumbnail/class-49.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-50',
    title: 'Last Warriors',
    description: 'Last Warriors - Classroom6x unblocked game',
    url: 'Classroom6x/class-50.html',
    thumbnail: 'thumbnail/class-50.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-51',
    title: '12 Mini Battles 2',
    description: '12 Mini Battles 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-51.html',
    thumbnail: 'thumbnail/class-51.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-52',
    title: 'Rree Kick Screamers',
    description: 'Rree Kick Screamers - Classroom6x unblocked game',
    url: 'Classroom6x/class-52.html',
    thumbnail: 'thumbnail/class-52.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-53',
    title: 'Sky Mad',
    description: 'Sky Mad - Classroom6x unblocked game',
    url: 'Classroom6x/class-53.html',
    thumbnail: 'thumbnail/class-53.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-54',
    title: 'Rally Point 2',
    description: 'Rally Point 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-54.html',
    thumbnail: 'thumbnail/class-54.png',
    category: '3D'
  },
  {
    id: 'classroom6x-55',
    title: 'Rally Point 5',
    description: 'Rally Point 5 - Classroom6x unblocked game',
    url: 'Classroom6x/class-55.html',
    thumbnail: 'thumbnail/class-55.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-56',
    title: 'Freeway Fury',
    description: 'Freeway Fury - Classroom6x unblocked game',
    url: 'Classroom6x/class-56.html',
    thumbnail: 'thumbnail/class-56.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-57',
    title: 'Final Ninja Html5',
    description: 'Final Ninja Html5 - Classroom6x unblocked game',
    url: 'Classroom6x/class-57.html',
    thumbnail: 'thumbnail/class-57.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-58',
    title: 'Clash Of Tanks',
    description: 'Clash Of Tanks - Classroom6x unblocked game',
    url: 'Classroom6x/class-58.html',
    thumbnail: 'thumbnail/class-58.png',
    category: 'Multiplayer'
  },
  {
    id: 'classroom6x-59',
    title: 'Skateboard Hero',
    description: 'Skateboard Hero - Classroom6x unblocked game',
    url: 'Classroom6x/class-59.html',
    thumbnail: 'thumbnail/class-59.png',
    category: 'Racing'
  },
  {
    id: 'classroom6x-60',
    title: 'Rally Point',
    description: 'Rally Point - Classroom6x unblocked game',
    url: 'Classroom6x/class-60.html',
    thumbnail: 'thumbnail/class-60.png',
    category: '3D'
  },
  {
    id: 'classroom6x-61',
    title: 'Rebels Clash',
    description: 'Rebels Clash - Classroom6x unblocked game',
    url: 'Classroom6x/class-61.html',
    thumbnail: 'thumbnail/class-61.png',
    category: '3D'
  },
  {
    id: 'classroom6x-62',
    title: 'Survival Express',
    description: 'Survival Express - Classroom6x unblocked game',
    url: 'Classroom6x/class-62.html',
    thumbnail: 'thumbnail/class-62.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-63',
    title: 'Blood Drift',
    description: 'Blood Drift - Classroom6x unblocked game',
    url: 'Classroom6x/class-63.html',
    thumbnail: 'thumbnail/class-63.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-64',
    title: 'Boxing Fighter Shadow Battle',
    description: 'Boxing Fighter Shadow Battle - Classroom6x unblocked game',
    url: 'Classroom6x/class-64.html',
    thumbnail: 'thumbnail/class-64.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-65',
    title: 'Gladiator True Story',
    description: 'Gladiator True Story - Classroom6x unblocked game',
    url: 'Classroom6x/class-65.html',
    thumbnail: 'thumbnail/class-65.png',
    category: '3D'
  },
  {
    id: 'classroom6x-66',
    title: 'Penalty Rivals',
    description: 'Penalty Rivals - Classroom6x unblocked game',
    url: 'Classroom6x/class-66.html',
    thumbnail: 'thumbnail/class-66.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-67',
    title: 'Mini Guardians Castle Defense',
    description: 'Mini Guardians Castle Defense - Classroom6x unblocked game',
    url: 'Classroom6x/class-67.html',
    thumbnail: 'thumbnail/class-67.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-68',
    title: 'Rally Point 3',
    description: 'Rally Point 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-68.html',
    thumbnail: 'thumbnail/class-68.png',
    category: '3D'
  },
  {
    id: 'classroom6x-70',
    title: 'Hoppenhelm',
    description: 'Hoppenhelm - Classroom6x unblocked game',
    url: 'Classroom6x/class-70.html',
    thumbnail: 'thumbnail/class-70.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-71',
    title: 'Water Polo Ragdoll',
    description: 'Water Polo Ragdoll - Classroom6x unblocked game',
    url: 'Classroom6x/class-71.html',
    thumbnail: 'thumbnail/class-71.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-72',
    title: 'Bumpy Jumpy',
    description: 'Bumpy Jumpy - Classroom6x unblocked game',
    url: 'Classroom6x/class-72.html',
    thumbnail: 'thumbnail/class-72.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-73',
    title: 'Dadish 3D',
    description: 'Dadish 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-73.html',
    thumbnail: 'thumbnail/class-73.png',
    category: '3D'
  },
  {
    id: 'classroom6x-74',
    title: 'Stickman Run',
    description: 'Stickman Run - Classroom6x unblocked game',
    url: 'Classroom6x/class-74.html',
    thumbnail: 'thumbnail/class-74.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-75',
    title: 'Stickman Parkour 3',
    description: 'Stickman Parkour 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-75.html',
    thumbnail: 'thumbnail/class-75.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-76',
    title: 'Doctor Teeth',
    description: 'Doctor Teeth - Classroom6x unblocked game',
    url: 'Classroom6x/class-76.html',
    thumbnail: 'thumbnail/class-76.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-77',
    title: 'Cubies',
    description: 'Cubies - Classroom6x unblocked game',
    url: 'Classroom6x/class-77.html',
    thumbnail: 'thumbnail/class-77.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-78',
    title: 'Doctor Acorn 3',
    description: 'Doctor Acorn 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-78.html',
    thumbnail: 'thumbnail/class-78.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-79',
    title: 'Papas Cheeseria',
    description: 'Papas Cheeseria - Classroom6x unblocked game',
    url: 'Classroom6x/class-79.html',
    thumbnail: 'thumbnail/class-79.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-80',
    title: 'Temple Run 2 Holi Festival',
    description: 'Temple Run 2 Holi Festival - Classroom6x unblocked game',
    url: 'Classroom6x/class-80.html',
    thumbnail: 'thumbnail/class-80.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-81',
    title: 'Barbershop Inc',
    description: 'Barbershop Inc - Classroom6x unblocked game',
    url: 'Classroom6x/class-81.html',
    thumbnail: 'thumbnail/class-81.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-82',
    title: 'Super Speeder',
    description: 'Super Speeder - Classroom6x unblocked game',
    url: 'Classroom6x/class-82.html',
    thumbnail: 'thumbnail/class-82.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-83',
    title: 'Finger Cook',
    description: 'Finger Cook - Classroom6x unblocked game',
    url: 'Classroom6x/class-83.html',
    thumbnail: 'thumbnail/class-83.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-84',
    title: 'Pull My Tongue',
    description: 'Pull My Tongue - Classroom6x unblocked game',
    url: 'Classroom6x/class-84.html',
    thumbnail: 'thumbnail/class-84.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-85',
    title: 'Super Girl Story',
    description: 'Super Girl Story - Classroom6x unblocked game',
    url: 'Classroom6x/class-85.html',
    thumbnail: 'thumbnail/class-85.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-86',
    title: 'Dadish',
    description: 'Dadish - Classroom6x unblocked game',
    url: 'Classroom6x/class-86.html',
    thumbnail: 'thumbnail/class-86.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-87',
    title: 'Cooking Fast Halloween',
    description: 'Cooking Fast Halloween - Classroom6x unblocked game',
    url: 'Classroom6x/class-87.html',
    thumbnail: 'thumbnail/class-87.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-88',
    title: 'Villain Quinn My Drawing Portfolio',
    description: 'Villain Quinn My Drawing Portfolio - Classroom6x unblocked game',
    url: 'Classroom6x/class-88.html',
    thumbnail: 'thumbnail/class-88.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-89',
    title: 'Hipster vs Rockers',
    description: 'Hipster vs Rockers - Classroom6x unblocked game',
    url: 'Classroom6x/class-89.html',
    thumbnail: 'thumbnail/class-89.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-90',
    title: 'Daddy Long Legs',
    description: 'Daddy Long Legs - Classroom6x unblocked game',
    url: 'Classroom6x/class-90.html',
    thumbnail: 'thumbnail/class-90.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-91',
    title: 'Popit vs Spinner',
    description: 'Popit vs Spinner - Classroom6x unblocked game',
    url: 'Classroom6x/class-91.html',
    thumbnail: 'thumbnail/class-91.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-92',
    title: 'Dana Relics For Sale',
    description: 'Dana Relics For Sale - Classroom6x unblocked game',
    url: 'Classroom6x/class-92.html',
    thumbnail: 'thumbnail/class-92.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-93',
    title: 'Football Penalty Champions',
    description: 'Football Penalty Champions - Classroom6x unblocked game',
    url: 'Classroom6x/class-93.html',
    thumbnail: 'thumbnail/class-93.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-94',
    title: 'Cats Love Cake 2',
    description: 'Cats Love Cake 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-94.html',
    thumbnail: 'thumbnail/class-94.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-95',
    title: 'Restaurant Aand Cooking',
    description: 'Restaurant Aand Cooking - Classroom6x unblocked game',
    url: 'Classroom6x/class-95.html',
    thumbnail: 'thumbnail/class-95.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-96',
    title: 'Meow Merge',
    description: 'Meow Merge - Classroom6x unblocked game',
    url: 'Classroom6x/class-96.html',
    thumbnail: 'thumbnail/class-96.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-97',
    title: 'Cat Coffee Shop',
    description: 'Cat Coffee Shop - Classroom6x unblocked game',
    url: 'Classroom6x/class-97.html',
    thumbnail: 'thumbnail/class-97.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-98',
    title: 'Funny Throat Surgery',
    description: 'Funny Throat Surgery - Classroom6x unblocked game',
    url: 'Classroom6x/class-98.html',
    thumbnail: 'thumbnail/class-98.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-99',
    title: 'Zuma Boom',
    description: 'Zuma Boom - Classroom6x unblocked game',
    url: 'Classroom6x/class-99.html',
    thumbnail: 'thumbnail/class-99.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-100',
    title: 'Towntopia',
    description: 'Towntopia - Classroom6x unblocked game',
    url: 'Classroom6x/class-100.html',
    thumbnail: 'thumbnail/class-100.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-101',
    title: 'Duck Life Battle',
    description: 'Duck Life Battle - Classroom6x unblocked game',
    url: 'Classroom6x/class-101.html',
    thumbnail: 'thumbnail/class-101.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-102',
    title: 'Funny Eye Surgery',
    description: 'Funny Eye Surgery - Classroom6x unblocked game',
    url: 'Classroom6x/class-102.html',
    thumbnail: 'thumbnail/class-102.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-103',
    title: 'Temple Run 2 Jungle Fall',
    description: 'Temple Run 2 Jungle Fall - Classroom6x unblocked game',
    url: 'Classroom6x/class-103.html',
    thumbnail: 'thumbnail/class-103.png',
    category: '3D'
  },
  {
    id: 'classroom6x-104',
    title: 'Yokai Dungeon',
    description: 'Yokai Dungeon - Classroom6x unblocked game',
    url: 'Classroom6x/class-104.html',
    thumbnail: 'thumbnail/class-104.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-105',
    title: 'Pony Run Magic Trails',
    description: 'Pony Run Magic Trails - Classroom6x unblocked game',
    url: 'Classroom6x/class-105.html',
    thumbnail: 'thumbnail/class-105.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-106',
    title: 'Puffy Cat 2',
    description: 'Puffy Cat 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-106.html',
    thumbnail: 'thumbnail/class-106.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-107',
    title: 'Funny Ear Surgery',
    description: 'Funny Ear Surgery - Classroom6x unblocked game',
    url: 'Classroom6x/class-107.html',
    thumbnail: 'thumbnail/class-107.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-108',
    title: 'Ice Cream Please',
    description: 'Ice Cream Please - Classroom6x unblocked game',
    url: 'Classroom6x/class-108.html',
    thumbnail: 'thumbnail/class-108.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-109',
    title: 'Yummy Toast',
    description: 'Yummy Toast - Classroom6x unblocked game',
    url: 'Classroom6x/class-109.html',
    thumbnail: 'thumbnail/class-109.png',
    category: 'Simulation'
  },
  {
    id: 'classroom6x-110',
    title: 'Catch The Candy Html5',
    description: 'Catch The Candy Html5 - Classroom6x unblocked game',
    url: 'Classroom6x/class-110.html',
    thumbnail: 'thumbnail/class-110.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-111',
    title: 'Princess Room Cleaning',
    description: 'Princess Room Cleaning - Classroom6x unblocked game',
    url: 'Classroom6x/class-111.html',
    thumbnail: 'thumbnail/class-111.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-112',
    title: 'Doctor Teeth 2',
    description: 'Doctor Teeth 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-112.html',
    thumbnail: 'thumbnail/class-112.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-113',
    title: 'Cooking Fast',
    description: 'Cooking Fast - Classroom6x unblocked game',
    url: 'Classroom6x/class-113.html',
    thumbnail: 'thumbnail/class-113.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-114',
    title: 'Dungeons Dressups',
    description: 'Dungeons Dressups - Classroom6x unblocked game',
    url: 'Classroom6x/class-114.html',
    thumbnail: 'thumbnail/class-114.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-115',
    title: 'Funny Dentist Surgery',
    description: 'Funny Dentist Surgery - Classroom6x unblocked game',
    url: 'Classroom6x/class-115.html',
    thumbnail: 'thumbnail/class-115.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-116',
    title: 'La Petite Avril',
    description: 'La Petite Avril - Classroom6x unblocked game',
    url: 'Classroom6x/class-116.html',
    thumbnail: 'thumbnail/class-116.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-117',
    title: 'Doctor Hero',
    description: 'Doctor Hero - Classroom6x unblocked game',
    url: 'Classroom6x/class-117.html',
    thumbnail: 'thumbnail/class-117.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-118',
    title: 'True Love Calculator',
    description: 'True Love Calculator - Classroom6x unblocked game',
    url: 'Classroom6x/class-118.html',
    thumbnail: 'thumbnail/class-118.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-119',
    title: 'Dress Up The Lovely Princess',
    description: 'Dress Up The Lovely Princess - Classroom6x unblocked game',
    url: 'Classroom6x/class-119.html',
    thumbnail: 'thumbnail/class-119.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-120',
    title: 'Become a Dentist',
    description: 'Become a Dentist - Classroom6x unblocked game',
    url: 'Classroom6x/class-120.html',
    thumbnail: 'thumbnail/class-120.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-121',
    title: 'Become A Fashion Designer',
    description: 'Become A Fashion Designer - Classroom6x unblocked game',
    url: 'Classroom6x/class-121.html',
    thumbnail: 'thumbnail/class-121.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-122',
    title: 'Mermaid Dress Up',
    description: 'Mermaid Dress Up - Classroom6x unblocked game',
    url: 'Classroom6x/class-122.html',
    thumbnail: 'thumbnail/class-122.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-123',
    title: 'Temple Run 2 Frozen Festival',
    description: 'Temple Run 2 Frozen Festival - Classroom6x unblocked game',
    url: 'Classroom6x/class-123.html',
    thumbnail: 'thumbnail/class-123.png',
    category: '3D'
  },
  {
    id: 'classroom6x-124',
    title: 'Glam Girl Dress Up And Makeover',
    description: 'Glam Girl Dress Up And Makeover - Classroom6x unblocked game',
    url: 'Classroom6x/class-124.html',
    thumbnail: 'thumbnail/class-124.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-125',
    title: 'Forgotten Hill The Wardrobe 4',
    description: 'Forgotten Hill The Wardrobe 4 - Classroom6x unblocked game',
    url: 'Classroom6x/class-125.html',
    thumbnail: 'thumbnail/class-125.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-126',
    title: 'Forgotten Hill The Wardrobe 3',
    description: 'Forgotten Hill The Wardrobe 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-126.html',
    thumbnail: 'thumbnail/class-126.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-127',
    title: 'Infinite Soccer',
    description: 'Infinite Soccer - Classroom6x unblocked game',
    url: 'Classroom6x/class-127.html',
    thumbnail: 'thumbnail/class-127.png',
    category: '3D'
  },
  {
    id: 'classroom6x-128',
    title: 'One Hundred Castles Solitaire',
    description: 'One Hundred Castles Solitaire - Classroom6x unblocked game',
    url: 'Classroom6x/class-128.html',
    thumbnail: 'thumbnail/class-128.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-129',
    title: 'Unicycle Legend',
    description: 'Unicycle Legend - Classroom6x unblocked game',
    url: 'Classroom6x/class-129.html',
    thumbnail: 'thumbnail/class-129.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-130',
    title: 'Monster Merge',
    description: 'Monster Merge - Classroom6x unblocked game',
    url: 'Classroom6x/class-130.html',
    thumbnail: 'thumbnail/class-130.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-131',
    title: 'Fast Food Dumpster Adventure',
    description: 'Fast Food Dumpster Adventure - Classroom6x unblocked game',
    url: 'Classroom6x/class-131.html',
    thumbnail: 'thumbnail/class-131.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-132',
    title: 'Slime Laboratory 3',
    description: 'Slime Laboratory 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-132.html',
    thumbnail: 'thumbnail/class-132.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-133',
    title: 'CircloO 2',
    description: 'CircloO 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-133.html',
    thumbnail: 'thumbnail/class-133.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-134',
    title: 'Temple Run 2: Frozen Shadows',
    description: 'Temple Run 2: Frozen Shadows - Classroom6x unblocked game',
    url: 'Classroom6x/class-134.html',
    thumbnail: 'thumbnail/class-134.png',
    category: '3D'
  },
  {
    id: 'classroom6x-135',
    title: 'Snake',
    description: 'Snake - Classroom6x unblocked game',
    url: 'Classroom6x/class-135.html',
    thumbnail: 'thumbnail/class-135.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-136',
    title: 'Pizzapunk',
    description: 'Pizzapunk - Classroom6x unblocked game',
    url: 'Classroom6x/class-136.html',
    thumbnail: 'thumbnail/class-136.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-137',
    title: '9 Balls Pool',
    description: '9 Balls Pool - Classroom6x unblocked game',
    url: 'Classroom6x/class-137.html',
    thumbnail: 'thumbnail/class-137.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-138',
    title: 'Twirl',
    description: 'Twirl - Classroom6x unblocked game',
    url: 'Classroom6x/class-138.html',
    thumbnail: 'thumbnail/class-138.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-139',
    title: 'Into The Pit',
    description: 'Into The Pit - Classroom6x unblocked game',
    url: 'Classroom6x/class-139.html',
    thumbnail: 'thumbnail/class-139.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-140',
    title: 'Mimelet',
    description: 'Mimelet - Classroom6x unblocked game',
    url: 'Classroom6x/class-140.html',
    thumbnail: 'thumbnail/class-140.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-142',
    title: 'Cats Love Cake',
    description: 'Cats Love Cake - Classroom6x unblocked game',
    url: 'Classroom6x/class-142.html',
    thumbnail: 'thumbnail/class-142.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-143',
    title: 'Footyzag',
    description: 'Footyzag - Classroom6x unblocked game',
    url: 'Classroom6x/class-143.html',
    thumbnail: 'thumbnail/class-143.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-144',
    title: 'Farm Battles',
    description: 'Farm Battles - Classroom6x unblocked game',
    url: 'Classroom6x/class-144.html',
    thumbnail: 'thumbnail/class-144.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-145',
    title: 'Mowing Mazes',
    description: 'Mowing Mazes - Classroom6x unblocked game',
    url: 'Classroom6x/class-145.html',
    thumbnail: 'thumbnail/class-145.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-146',
    title: 'Speed Pool King',
    description: 'Speed Pool King - Classroom6x unblocked game',
    url: 'Classroom6x/class-146.html',
    thumbnail: 'thumbnail/class-146.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-147',
    title: 'Word Monsters',
    description: 'Word Monsters - Classroom6x unblocked game',
    url: 'Classroom6x/class-147.html',
    thumbnail: 'thumbnail/class-147.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-148',
    title: 'Box Kid Puzzles',
    description: 'Box Kid Puzzles - Classroom6x unblocked game',
    url: 'Classroom6x/class-148.html',
    thumbnail: 'thumbnail/class-148.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-149',
    title: 'Word Boss',
    description: 'Word Boss - Classroom6x unblocked game',
    url: 'Classroom6x/class-149.html',
    thumbnail: 'thumbnail/class-149.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-150',
    title: 'Flags Maniac',
    description: 'Flags Maniac - Classroom6x unblocked game',
    url: 'Classroom6x/class-150.html',
    thumbnail: 'thumbnail/class-150.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-151',
    title: 'Wordoku',
    description: 'Wordoku - Classroom6x unblocked game',
    url: 'Classroom6x/class-151.html',
    thumbnail: 'thumbnail/class-151.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-152',
    title: 'Mummys Path Deluxe',
    description: 'Mummys Path Deluxe - Classroom6x unblocked game',
    url: 'Classroom6x/class-152.html',
    thumbnail: 'thumbnail/class-152.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-153',
    title: 'Wordy Pop',
    description: 'Wordy Pop - Classroom6x unblocked game',
    url: 'Classroom6x/class-153.html',
    thumbnail: 'thumbnail/class-153.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-154',
    title: 'Typing Fighter',
    description: 'Typing Fighter - Classroom6x unblocked game',
    url: 'Classroom6x/class-154.html',
    thumbnail: 'thumbnail/class-154.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-155',
    title: 'Zen Blocks',
    description: 'Zen Blocks - Classroom6x unblocked game',
    url: 'Classroom6x/class-155.html',
    thumbnail: 'thumbnail/class-155.png',
    category: '3D'
  },
  {
    id: 'classroom6x-156',
    title: 'Twice',
    description: 'Twice - Classroom6x unblocked game',
    url: 'Classroom6x/class-156.html',
    thumbnail: 'thumbnail/class-156.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-157',
    title: 'Amazing Bubble  Breaker',
    description: 'Amazing Bubble  Breaker - Classroom6x unblocked game',
    url: 'Classroom6x/class-157.html',
    thumbnail: 'thumbnail/class-157.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-158',
    title: 'Cat Room Blast',
    description: 'Cat Room Blast - Classroom6x unblocked game',
    url: 'Classroom6x/class-158.html',
    thumbnail: 'thumbnail/class-158.png',
    category: '3D'
  },
  {
    id: 'classroom6x-159',
    title: 'Amazing Bubble Connect',
    description: 'Amazing Bubble Connect - Classroom6x unblocked game',
    url: 'Classroom6x/class-159.html',
    thumbnail: 'thumbnail/class-159.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-160',
    title: 'Onet Fruit Classic',
    description: 'Onet Fruit Classic - Classroom6x unblocked game',
    url: 'Classroom6x/class-160.html',
    thumbnail: 'thumbnail/class-160.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-161',
    title: 'Cubinko',
    description: 'Cubinko - Classroom6x unblocked game',
    url: 'Classroom6x/class-161.html',
    thumbnail: 'thumbnail/class-161.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-162',
    title: 'Genie Quest',
    description: 'Genie Quest - Classroom6x unblocked game',
    url: 'Classroom6x/class-162.html',
    thumbnail: 'thumbnail/class-162.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-163',
    title: 'Stack City',
    description: 'Stack City - Classroom6x unblocked game',
    url: 'Classroom6x/class-163.html',
    thumbnail: 'thumbnail/class-163.png',
    category: '3D'
  },
  {
    id: 'classroom6x-164',
    title: 'Forgotten Hill Memento Love Beyond',
    description: 'Forgotten Hill Memento Love Beyond - Classroom6x unblocked game',
    url: 'Classroom6x/class-164.html',
    thumbnail: 'thumbnail/class-164.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-165',
    title: 'Blue',
    description: 'Blue - Classroom6x unblocked game',
    url: 'Classroom6x/class-165.html',
    thumbnail: 'thumbnail/class-165.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-166',
    title: 'Pink',
    description: 'Pink - Classroom6x unblocked game',
    url: 'Classroom6x/class-166.html',
    thumbnail: 'thumbnail/class-166.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-167',
    title: 'One Button Bounce',
    description: 'One Button Bounce - Classroom6x unblocked game',
    url: 'Classroom6x/class-167.html',
    thumbnail: 'thumbnail/class-167.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-168',
    title: 'Forgotten Hill: The Wardrobe',
    description: 'Forgotten Hill: The Wardrobe - Classroom6x unblocked game',
    url: 'Classroom6x/class-168.html',
    thumbnail: 'thumbnail/class-168.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-169',
    title: 'Pizzafall',
    description: 'Pizzafall - Classroom6x unblocked game',
    url: 'Classroom6x/class-169.html',
    thumbnail: 'thumbnail/class-169.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-170',
    title: 'Simply Prop Hunt',
    description: 'Simply Prop Hunt - Classroom6x unblocked game',
    url: 'Classroom6x/class-170.html',
    thumbnail: 'thumbnail/class-170.png',
    category: '3D'
  },
  {
    id: 'classroom6x-171',
    title: 'Chicken Sword Ninja Master',
    description: 'Chicken Sword Ninja Master - Classroom6x unblocked game',
    url: 'Classroom6x/class-171.html',
    thumbnail: 'thumbnail/class-171.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-172',
    title: 'Tumble Wrestling',
    description: 'Tumble Wrestling - Classroom6x unblocked game',
    url: 'Classroom6x/class-172.html',
    thumbnail: 'thumbnail/class-172.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-173',
    title: 'Stick Fortress',
    description: 'Stick Fortress - Classroom6x unblocked game',
    url: 'Classroom6x/class-173.html',
    thumbnail: 'thumbnail/class-173.png',
    category: 'Strategy'
  },
  {
    id: 'classroom6x-174',
    title: 'We Skate',
    description: 'We Skate - Classroom6x unblocked game',
    url: 'Classroom6x/class-174.html',
    thumbnail: 'thumbnail/class-174.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-175',
    title: 'Time Clones',
    description: 'Time Clones - Classroom6x unblocked game',
    url: 'Classroom6x/class-175.html',
    thumbnail: 'thumbnail/class-175.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-176',
    title: 'Arrow Pathway',
    description: 'Arrow Pathway - Classroom6x unblocked game',
    url: 'Classroom6x/class-176.html',
    thumbnail: 'thumbnail/class-176.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-177',
    title: 'Ledge Throw',
    description: 'Ledge Throw - Classroom6x unblocked game',
    url: 'Classroom6x/class-177.html',
    thumbnail: 'thumbnail/class-177.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-178',
    title: 'Platform Countdown',
    description: 'Platform Countdown - Classroom6x unblocked game',
    url: 'Classroom6x/class-178.html',
    thumbnail: 'thumbnail/class-178.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-179',
    title: 'Jump And Hover',
    description: 'Jump And Hover - Classroom6x unblocked game',
    url: 'Classroom6x/class-179.html',
    thumbnail: 'thumbnail/class-179.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-180',
    title: 'Hop Warp',
    description: 'Hop Warp - Classroom6x unblocked game',
    url: 'Classroom6x/class-180.html',
    thumbnail: 'thumbnail/class-180.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-181',
    title: 'Blockins',
    description: 'Blockins - Classroom6x unblocked game',
    url: 'Classroom6x/class-181.html',
    thumbnail: 'thumbnail/class-181.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-182',
    title: 'Growmi',
    description: 'Growmi - Classroom6x unblocked game',
    url: 'Classroom6x/class-182.html',
    thumbnail: 'thumbnail/class-182.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-183',
    title: 'Blumgi Bloom',
    description: 'Blumgi Bloom - Classroom6x unblocked game',
    url: 'Classroom6x/class-183.html',
    thumbnail: 'thumbnail/class-183.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-184',
    title: 'Connect 248',
    description: 'Connect 248 - Classroom6x unblocked game',
    url: 'Classroom6x/class-184.html',
    thumbnail: 'thumbnail/class-184.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-185',
    title: 'Cosmos Lines',
    description: 'Cosmos Lines - Classroom6x unblocked game',
    url: 'Classroom6x/class-185.html',
    thumbnail: 'thumbnail/class-185.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-186',
    title: 'Lines To Fill',
    description: 'Lines To Fill - Classroom6x unblocked game',
    url: 'Classroom6x/class-186.html',
    thumbnail: 'thumbnail/class-186.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-187',
    title: 'Rhomb',
    description: 'Rhomb - Classroom6x unblocked game',
    url: 'Classroom6x/class-187.html',
    thumbnail: 'thumbnail/class-187.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-188',
    title: 'Ludo Hero',
    description: 'Ludo Hero - Classroom6x unblocked game',
    url: 'Classroom6x/class-188.html',
    thumbnail: 'thumbnail/class-188.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-189',
    title: 'Sudoku Village',
    description: 'Sudoku Village - Classroom6x unblocked game',
    url: 'Classroom6x/class-189.html',
    thumbnail: 'thumbnail/class-189.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-190',
    title: 'Ultimate Sudoku',
    description: 'Ultimate Sudoku - Classroom6x unblocked game',
    url: 'Classroom6x/class-190.html',
    thumbnail: 'thumbnail/class-190.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-191',
    title: 'Impossible 13',
    description: 'Impossible 13 - Classroom6x unblocked game',
    url: 'Classroom6x/class-191.html',
    thumbnail: 'thumbnail/class-191.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-192',
    title: 'Pixel Puzzles',
    description: 'Pixel Puzzles - Classroom6x unblocked game',
    url: 'Classroom6x/class-192.html',
    thumbnail: 'thumbnail/class-192.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-193',
    title: 'Logic Master 1',
    description: 'Logic Master 1 - Classroom6x unblocked game',
    url: 'Classroom6x/class-193.html',
    thumbnail: 'thumbnail/class-193.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-194',
    title: 'Its Story Time',
    description: 'Its Story Time - Classroom6x unblocked game',
    url: 'Classroom6x/class-194.html',
    thumbnail: 'thumbnail/class-194.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-195',
    title: 'Hangman',
    description: 'Hangman - Classroom6x unblocked game',
    url: 'Classroom6x/class-195.html',
    thumbnail: 'thumbnail/class-195.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-196',
    title: 'Trivia Crack',
    description: 'Trivia Crack - Classroom6x unblocked game',
    url: 'Classroom6x/class-196.html',
    thumbnail: 'thumbnail/class-196.png',
    category: 'Multiplayer'
  },
  {
    id: 'classroom6x-197',
    title: 'Light The Lamp',
    description: 'Light The Lamp - Classroom6x unblocked game',
    url: 'Classroom6x/class-197.html',
    thumbnail: 'thumbnail/class-197.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-198',
    title: 'Unpuzzler',
    description: 'Unpuzzler - Classroom6x unblocked game',
    url: 'Classroom6x/class-198.html',
    thumbnail: 'thumbnail/class-198.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-199',
    title: 'Brain Dozer',
    description: 'Brain Dozer - Classroom6x unblocked game',
    url: 'Classroom6x/class-199.html',
    thumbnail: 'thumbnail/class-199.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-200',
    title: 'Gem 11',
    description: 'Gem 11 - Classroom6x unblocked game',
    url: 'Classroom6x/class-200.html',
    thumbnail: 'thumbnail/class-200.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-201',
    title: 'Jr Chess',
    description: 'Jr Chess - Classroom6x unblocked game',
    url: 'Classroom6x/class-201.html',
    thumbnail: 'thumbnail/class-201.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-202',
    title: 'Casual Chess',
    description: 'Casual Chess - Classroom6x unblocked game',
    url: 'Classroom6x/class-202.html',
    thumbnail: 'thumbnail/class-202.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-203',
    title: 'Spider Solitaire',
    description: 'Spider Solitaire - Classroom6x unblocked game',
    url: 'Classroom6x/class-203.html',
    thumbnail: 'thumbnail/class-203.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-204',
    title: 'Solitaire Reverse',
    description: 'Solitaire Reverse - Classroom6x unblocked game',
    url: 'Classroom6x/class-204.html',
    thumbnail: 'thumbnail/class-204.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-205',
    title: 'Refuge Solitaire',
    description: 'Refuge Solitaire - Classroom6x unblocked game',
    url: 'Classroom6x/class-205.html',
    thumbnail: 'thumbnail/class-205.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-206',
    title: 'Tingly Ppyramid Solitaire',
    description: 'Tingly Ppyramid Solitaire - Classroom6x unblocked game',
    url: 'Classroom6x/class-206.html',
    thumbnail: 'thumbnail/class-206.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-207',
    title: 'Kubi Pets',
    description: 'Kubi Pets - Classroom6x unblocked game',
    url: 'Classroom6x/class-207.html',
    thumbnail: 'thumbnail/class-207.png',
    category: '3D'
  },
  {
    id: 'classroom6x-208',
    title: 'Combo Crusader',
    description: 'Combo Crusader - Classroom6x unblocked game',
    url: 'Classroom6x/class-208.html',
    thumbnail: 'thumbnail/class-208.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-209',
    title: 'Ultimate Tic Tac Toe',
    description: 'Ultimate Tic Tac Toe - Classroom6x unblocked game',
    url: 'Classroom6x/class-209.html',
    thumbnail: 'thumbnail/class-209.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-210',
    title: 'Sudoku',
    description: 'Sudoku - Classroom6x unblocked game',
    url: 'Classroom6x/class-210.html',
    thumbnail: 'thumbnail/class-210.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-211',
    title: 'Jungle Bubble Shooter Mania',
    description: 'Jungle Bubble Shooter Mania - Classroom6x unblocked game',
    url: 'Classroom6x/class-211.html',
    thumbnail: 'thumbnail/class-211.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-212',
    title: 'Jigsaw Photo Puzzle Summer',
    description: 'Jigsaw Photo Puzzle Summer - Classroom6x unblocked game',
    url: 'Classroom6x/class-212.html',
    thumbnail: 'thumbnail/class-212.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-213',
    title: 'Jigsaw Photo Puzzle Christmas',
    description: 'Jigsaw Photo Puzzle Christmas - Classroom6x unblocked game',
    url: 'Classroom6x/class-213.html',
    thumbnail: 'thumbnail/class-213.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-214',
    title: 'Jigsaw Photo Puzzle Winter',
    description: 'Jigsaw Photo Puzzle Winter - Classroom6x unblocked game',
    url: 'Classroom6x/class-214.html',
    thumbnail: 'thumbnail/class-214.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-215',
    title: 'Photo Puzzle Slide Edition',
    description: 'Photo Puzzle Slide Edition - Classroom6x unblocked game',
    url: 'Classroom6x/class-215.html',
    thumbnail: 'thumbnail/class-215.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-216',
    title: 'Mahjong',
    description: 'Mahjong - Classroom6x unblocked game',
    url: 'Classroom6x/class-216.html',
    thumbnail: 'thumbnail/class-216.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-217',
    title: 'Classic Mahjong',
    description: 'Classic Mahjong - Classroom6x unblocked game',
    url: 'Classroom6x/class-217.html',
    thumbnail: 'thumbnail/class-217.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-218',
    title: 'Mahjong Linker Kyodai Game',
    description: 'Mahjong Linker Kyodai Game - Classroom6x unblocked game',
    url: 'Classroom6x/class-218.html',
    thumbnail: 'thumbnail/class-218.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-219',
    title: 'Sweety Mahjong',
    description: 'Sweety Mahjong - Classroom6x unblocked game',
    url: 'Classroom6x/class-219.html',
    thumbnail: 'thumbnail/class-219.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-220',
    title: 'Chessformer',
    description: 'Chessformer - Classroom6x unblocked game',
    url: 'Classroom6x/class-220.html',
    thumbnail: 'thumbnail/class-220.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-221',
    title: 'Chess Grandmaster',
    description: 'Chess Grandmaster - Classroom6x unblocked game',
    url: 'Classroom6x/class-221.html',
    thumbnail: 'thumbnail/class-221.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-222',
    title: 'Goose Game',
    description: 'Goose Game - Classroom6x unblocked game',
    url: 'Classroom6x/class-222.html',
    thumbnail: 'thumbnail/class-222.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-223',
    title: 'Australian Patience',
    description: 'Australian Patience - Classroom6x unblocked game',
    url: 'Classroom6x/class-223.html',
    thumbnail: 'thumbnail/class-223.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-224',
    title: 'Math Mahjong Relax',
    description: 'Math Mahjong Relax - Classroom6x unblocked game',
    url: 'Classroom6x/class-224.html',
    thumbnail: 'thumbnail/class-224.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-225',
    title: 'Lords Of Gomoku',
    description: 'Lords Of Gomoku - Classroom6x unblocked game',
    url: 'Classroom6x/class-225.html',
    thumbnail: 'thumbnail/class-225.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-226',
    title: 'Rainbow Star Pinball',
    description: 'Rainbow Star Pinball - Classroom6x unblocked game',
    url: 'Classroom6x/class-226.html',
    thumbnail: 'thumbnail/class-226.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-227',
    title: 'Teleport Jumper',
    description: 'Teleport Jumper - Classroom6x unblocked game',
    url: 'Classroom6x/class-227.html',
    thumbnail: 'thumbnail/class-227.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-228',
    title: 'Mini Train',
    description: 'Mini Train - Classroom6x unblocked game',
    url: 'Classroom6x/class-228.html',
    thumbnail: 'thumbnail/class-228.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-229',
    title: 'Flags Quiz',
    description: 'Flags Quiz - Classroom6x unblocked game',
    url: 'Classroom6x/class-229.html',
    thumbnail: 'thumbnail/class-229.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-230',
    title: 'Cute Puzzle Witch',
    description: 'Cute Puzzle Witch - Classroom6x unblocked game',
    url: 'Classroom6x/class-230.html',
    thumbnail: 'thumbnail/class-230.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-231',
    title: 'Cover Orange Wild West',
    description: 'Cover Orange Wild West - Classroom6x unblocked game',
    url: 'Classroom6x/class-231.html',
    thumbnail: 'thumbnail/class-231.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-233',
    title: 'Cover Orange Journey',
    description: 'Cover Orange Journey - Classroom6x unblocked game',
    url: 'Classroom6x/class-233.html',
    thumbnail: 'thumbnail/class-233.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-234',
    title: 'Merge To Million',
    description: 'Merge To Million - Classroom6x unblocked game',
    url: 'Classroom6x/class-234.html',
    thumbnail: 'thumbnail/class-234.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-235',
    title: 'Prismo Puzzles',
    description: 'Prismo Puzzles - Classroom6x unblocked game',
    url: 'Classroom6x/class-235.html',
    thumbnail: 'thumbnail/class-235.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-236',
    title: 'Duck Pond Mahjong',
    description: 'Duck Pond Mahjong - Classroom6x unblocked game',
    url: 'Classroom6x/class-236.html',
    thumbnail: 'thumbnail/class-236.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-237',
    title: 'Zombie Outbreak Arena',
    description: 'Zombie Outbreak Arena - Classroom6x unblocked game',
    url: 'Classroom6x/class-237.html',
    thumbnail: 'thumbnail/class-237.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-238',
    title: 'Yarn Untangle',
    description: 'Yarn Untangle - Classroom6x unblocked game',
    url: 'Classroom6x/class-238.html',
    thumbnail: 'thumbnail/class-238.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-239',
    title: 'Westoon',
    description: 'Westoon - Classroom6x unblocked game',
    url: 'Classroom6x/class-239.html',
    thumbnail: 'thumbnail/class-239.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-240',
    title: 'Total Recoil',
    description: 'Total Recoil - Classroom6x unblocked game',
    url: 'Classroom6x/class-240.html',
    thumbnail: 'thumbnail/class-240.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-241',
    title: 'Sumo Party',
    description: 'Sumo Party - Classroom6x unblocked game',
    url: 'Classroom6x/class-241.html',
    thumbnail: 'thumbnail/class-241.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-242',
    title: 'Stupid Zombies 2',
    description: 'Stupid Zombies 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-242.html',
    thumbnail: 'thumbnail/class-242.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-243',
    title: 'Space Major Miner',
    description: 'Space Major Miner - Classroom6x unblocked game',
    url: 'Classroom6x/class-243.html',
    thumbnail: 'thumbnail/class-243.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-244',
    title: 'Snakes and Ladders',
    description: 'Snakes and Ladders - Classroom6x unblocked game',
    url: 'Classroom6x/class-244.html',
    thumbnail: 'thumbnail/class-244.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-245',
    title: 'Vex 8',
    description: 'Vex 8 - Classroom6x unblocked game',
    url: 'Classroom6x/class-245.html',
    thumbnail: 'thumbnail/class-245.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-246',
    title: 'Sling Kong',
    description: 'Sling Kong - Classroom6x unblocked game',
    url: 'Classroom6x/class-246.html',
    thumbnail: 'thumbnail/class-246.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-247',
    title: 'Sink It',
    description: 'Sink It - Classroom6x unblocked game',
    url: 'Classroom6x/class-247.html',
    thumbnail: 'thumbnail/class-247.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-248',
    title: 'Pony DressUp 2',
    description: 'Pony DressUp 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-248.html',
    thumbnail: 'thumbnail/class-248.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-249',
    title: 'Ping Pong Chaos',
    description: 'Ping Pong Chaos - Classroom6x unblocked game',
    url: 'Classroom6x/class-249.html',
    thumbnail: 'thumbnail/class-249.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-250',
    title: 'Paint Strike',
    description: 'Paint Strike - Classroom6x unblocked game',
    url: 'Classroom6x/class-250.html',
    thumbnail: 'thumbnail/class-250.png',
    category: '3D'
  },
  {
    id: 'classroom6x-251',
    title: 'Nugget Royale',
    description: 'Nugget Royale - Classroom6x unblocked game',
    url: 'Classroom6x/class-251.html',
    thumbnail: 'thumbnail/class-251.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-252',
    title: 'Nightpoint.io',
    description: 'Nightpoint.io - Classroom6x unblocked game',
    url: 'Classroom6x/class-252.html',
    thumbnail: 'thumbnail/class-252.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-253',
    title: 'Master Checkers',
    description: 'Master Checkers - Classroom6x unblocked game',
    url: 'Classroom6x/class-253.html',
    thumbnail: 'thumbnail/class-253.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-254',
    title: 'Mafia Wars',
    description: 'Mafia Wars - Classroom6x unblocked game',
    url: 'Classroom6x/class-254.html',
    thumbnail: 'thumbnail/class-254.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-255',
    title: 'MadZOOng',
    description: 'MadZOOng - Classroom6x unblocked game',
    url: 'Classroom6x/class-255.html',
    thumbnail: 'thumbnail/class-255.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-256',
    title: 'Lovely Fox',
    description: 'Lovely Fox - Classroom6x unblocked game',
    url: 'Classroom6x/class-256.html',
    thumbnail: 'thumbnail/class-256.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-257',
    title: 'Lethal Sniper 3D: Army Soldier',
    description: 'Lethal Sniper 3D: Army Soldier - Classroom6x unblocked game',
    url: 'Classroom6x/class-257.html',
    thumbnail: 'thumbnail/class-257.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-258',
    title: 'Idle Gold Miner',
    description: 'Idle Gold Miner - Classroom6x unblocked game',
    url: 'Classroom6x/class-258.html',
    thumbnail: 'thumbnail/class-258.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-259',
    title: 'Gangster Contract Mafia Wars',
    description: 'Gangster Contract Mafia Wars - Classroom6x unblocked game',
    url: 'Classroom6x/class-259.html',
    thumbnail: 'thumbnail/class-259.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-260',
    title: 'Game of Farmers',
    description: 'Game of Farmers - Classroom6x unblocked game',
    url: 'Classroom6x/class-260.html',
    thumbnail: 'thumbnail/class-260.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-261',
    title: 'Eggbot vs Zombies',
    description: 'Eggbot vs Zombies - Classroom6x unblocked game',
    url: 'Classroom6x/class-261.html',
    thumbnail: 'thumbnail/class-261.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-262',
    title: 'Dyna Boy',
    description: 'Dyna Boy - Classroom6x unblocked game',
    url: 'Classroom6x/class-262.html',
    thumbnail: 'thumbnail/class-262.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-263',
    title: 'Ducklings.io',
    description: 'Ducklings.io - Classroom6x unblocked game',
    url: 'Classroom6x/class-263.html',
    thumbnail: 'thumbnail/class-263.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-265',
    title: 'Darts Pro',
    description: 'Darts Pro - Classroom6x unblocked game',
    url: 'Classroom6x/class-265.html',
    thumbnail: 'thumbnail/class-265.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-266',
    title: 'Court Kings 3D',
    description: 'Court Kings 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-266.html',
    thumbnail: 'thumbnail/class-266.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-267',
    title: 'Chicky Farm',
    description: 'Chicky Farm - Classroom6x unblocked game',
    url: 'Classroom6x/class-267.html',
    thumbnail: 'thumbnail/class-267.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-268',
    title: 'Cave Blast',
    description: 'Cave Blast - Classroom6x unblocked game',
    url: 'Classroom6x/class-268.html',
    thumbnail: 'thumbnail/class-268.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-269',
    title: 'Bomber Royale',
    description: 'Bomber Royale - Classroom6x unblocked game',
    url: 'Classroom6x/class-269.html',
    thumbnail: 'thumbnail/class-269.png',
    category: '3D'
  },
  {
    id: 'classroom6x-270',
    title: 'Become a Puppy Groomer',
    description: 'Become a Puppy Groomer - Classroom6x unblocked game',
    url: 'Classroom6x/class-270.html',
    thumbnail: 'thumbnail/class-270.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-271',
    title: 'Bearsus',
    description: 'Bearsus - Classroom6x unblocked game',
    url: 'Classroom6x/class-271.html',
    thumbnail: 'thumbnail/class-271.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-272',
    title: 'Bad Ice-Cream 3',
    description: 'Bad Ice-Cream 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-272.html',
    thumbnail: 'thumbnail/class-272.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-273',
    title: 'Bad Ice-Cream 2',
    description: 'Bad Ice-Cream 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-273.html',
    thumbnail: 'thumbnail/class-273.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-274',
    title: 'Animal Arena',
    description: 'Animal Arena - Classroom6x unblocked game',
    url: 'Classroom6x/class-274.html',
    thumbnail: 'thumbnail/class-274.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-275',
    title: 'Aliens Nest',
    description: 'Aliens Nest - Classroom6x unblocked game',
    url: 'Classroom6x/class-275.html',
    thumbnail: 'thumbnail/class-275.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-276',
    title: 'A Pretty Odd Bunny',
    description: 'A Pretty Odd Bunny - Classroom6x unblocked game',
    url: 'Classroom6x/class-276.html',
    thumbnail: 'thumbnail/class-276.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-277',
    title: '8bit Fiesta',
    description: '8bit Fiesta - Classroom6x unblocked game',
    url: 'Classroom6x/class-277.html',
    thumbnail: 'thumbnail/class-277.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-278',
    title: 'BoxRob 3',
    description: 'BoxRob 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-278.html',
    thumbnail: 'thumbnail/class-278.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-279',
    title: 'BoxRob 2',
    description: 'BoxRob 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-279.html',
    thumbnail: 'thumbnail/class-279.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-280',
    title: 'Boxrob',
    description: 'Boxrob - Classroom6x unblocked game',
    url: 'Classroom6x/class-280.html',
    thumbnail: 'thumbnail/class-280.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-281',
    title: 'Stickman fight ragdoll',
    description: 'Stickman fight ragdoll - Classroom6x unblocked game',
    url: 'Classroom6x/class-281.html',
    thumbnail: 'thumbnail/class-281.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-282',
    title: 'Bouncy basketball',
    description: 'Bouncy basketball - Classroom6x unblocked game',
    url: 'Classroom6x/class-282.html',
    thumbnail: 'thumbnail/class-282.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-283',
    title: 'Double panda',
    description: 'Double panda - Classroom6x unblocked game',
    url: 'Classroom6x/class-283.html',
    thumbnail: 'thumbnail/class-283.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-285',
    title: 'Truck Loader 5',
    description: 'Truck Loader 5 - Classroom6x unblocked game',
    url: 'Classroom6x/class-285.html',
    thumbnail: 'thumbnail/class-285.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-286',
    title: 'Truck Loader 4',
    description: 'Truck Loader 4 - Classroom6x unblocked game',
    url: 'Classroom6x/class-286.html',
    thumbnail: 'thumbnail/class-286.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-287',
    title: 'Truck Loader 3',
    description: 'Truck Loader 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-287.html',
    thumbnail: 'thumbnail/class-287.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-288',
    title: 'Truck Loader 2',
    description: 'Truck Loader 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-288.html',
    thumbnail: 'thumbnail/class-288.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-289',
    title: 'Truck Loader',
    description: 'Truck Loader - Classroom6x unblocked game',
    url: 'Classroom6x/class-289.html',
    thumbnail: 'thumbnail/class-289.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-290',
    title: 'Moving Truck: Bounty',
    description: 'Moving Truck: Bounty - Classroom6x unblocked game',
    url: 'Classroom6x/class-290.html',
    thumbnail: 'thumbnail/class-290.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-292',
    title: 'Duo Survival 3',
    description: 'Duo Survival 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-292.html',
    thumbnail: 'thumbnail/class-292.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-293',
    title: 'ZOOM-BE 3',
    description: 'ZOOM-BE 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-293.html',
    thumbnail: 'thumbnail/class-293.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-294',
    title: 'ZOOM-BE 2',
    description: 'ZOOM-BE 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-294.html',
    thumbnail: 'thumbnail/class-294.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-295',
    title: 'Shape Fold Nature',
    description: 'Shape Fold Nature - Classroom6x unblocked game',
    url: 'Classroom6x/class-295.html',
    thumbnail: 'thumbnail/class-295.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-296',
    title: 'Shape Fold',
    description: 'Shape Fold - Classroom6x unblocked game',
    url: 'Classroom6x/class-296.html',
    thumbnail: 'thumbnail/class-296.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-297',
    title: 'Shape Fold Animals',
    description: 'Shape Fold Animals - Classroom6x unblocked game',
    url: 'Classroom6x/class-297.html',
    thumbnail: 'thumbnail/class-297.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-298',
    title: 'Just Park It 12',
    description: 'Just Park It 12 - Classroom6x unblocked game',
    url: 'Classroom6x/class-298.html',
    thumbnail: 'thumbnail/class-298.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-299',
    title: '3D Monster Truck: Skyroads',
    description: '3D Monster Truck: Skyroads - Classroom6x unblocked game',
    url: 'Classroom6x/class-299.html',
    thumbnail: 'thumbnail/class-299.png',
    category: '3D'
  },
  {
    id: 'classroom6x-300',
    title: 'Moto Space Racing: 2 Player',
    description: 'Moto Space Racing: 2 Player - Classroom6x unblocked game',
    url: 'Classroom6x/class-300.html',
    thumbnail: 'thumbnail/class-300.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-301',
    title: 'War of Caribbean Pirates',
    description: 'War of Caribbean Pirates - Classroom6x unblocked game',
    url: 'Classroom6x/class-301.html',
    thumbnail: 'thumbnail/class-301.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-302',
    title: 'Monster Truck Racing Arena',
    description: 'Monster Truck Racing Arena - Classroom6x unblocked game',
    url: 'Classroom6x/class-302.html',
    thumbnail: 'thumbnail/class-302.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-303',
    title: 'Zombie Siege Outbreak',
    description: 'Zombie Siege Outbreak - Classroom6x unblocked game',
    url: 'Classroom6x/class-303.html',
    thumbnail: 'thumbnail/class-303.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-304',
    title: 'Burnout Extreme Drift 2',
    description: 'Burnout Extreme Drift 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-304.html',
    thumbnail: 'thumbnail/class-304.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-306',
    title: 'Tetris 99',
    description: 'Tetris 99 - Classroom6x unblocked game',
    url: 'Classroom6x/class-306.html',
    thumbnail: 'thumbnail/class-306.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-307',
    title: 'Duo Survival',
    description: 'Duo Survival - Classroom6x unblocked game',
    url: 'Classroom6x/class-307.html',
    thumbnail: 'thumbnail/class-307.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-308',
    title: 'Duo Survival 2',
    description: 'Duo Survival 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-308.html',
    thumbnail: 'thumbnail/class-308.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-309',
    title: 'Cow Bay',
    description: 'Cow Bay - Classroom6x unblocked game',
    url: 'Classroom6x/class-309.html',
    thumbnail: 'thumbnail/class-309.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-310',
    title: 'Duo Vikings 3',
    description: 'Duo Vikings 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-310.html',
    thumbnail: 'thumbnail/class-310.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-311',
    title: 'Duo Vikings 2',
    description: 'Duo Vikings 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-311.html',
    thumbnail: 'thumbnail/class-311.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-312',
    title: 'Duo Vikings',
    description: 'Duo Vikings - Classroom6x unblocked game',
    url: 'Classroom6x/class-312.html',
    thumbnail: 'thumbnail/class-312.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-313',
    title: 'Off-Road Rain Cargo Simulator',
    description: 'Off-Road Rain Cargo Simulator - Classroom6x unblocked game',
    url: 'Classroom6x/class-313.html',
    thumbnail: 'thumbnail/class-313.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-314',
    title: 'Highway Bike Simulator',
    description: 'Highway Bike Simulator - Classroom6x unblocked game',
    url: 'Classroom6x/class-314.html',
    thumbnail: 'thumbnail/class-314.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-315',
    title: 'Snail Bob 6',
    description: 'Snail Bob 6 - Classroom6x unblocked game',
    url: 'Classroom6x/class-315.html',
    thumbnail: 'thumbnail/class-315.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-316',
    title: 'ZOOM-BE',
    description: 'ZOOM-BE - Classroom6x unblocked game',
    url: 'Classroom6x/class-316.html',
    thumbnail: 'thumbnail/class-316.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-317',
    title: 'Element Bblocks',
    description: 'Element Bblocks - Classroom6x unblocked game',
    url: 'Classroom6x/class-317.html',
    thumbnail: 'thumbnail/class-317.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-318',
    title: 'Peppa Pig: Basketball',
    description: 'Peppa Pig: Basketball - Classroom6x unblocked game',
    url: 'Classroom6x/class-318.html',
    thumbnail: 'thumbnail/class-318.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-319',
    title: 'ColorUp',
    description: 'ColorUp - Classroom6x unblocked game',
    url: 'Classroom6x/class-319.html',
    thumbnail: 'thumbnail/class-319.png',
    category: '3D'
  },
  {
    id: 'classroom6x-320',
    title: 'Detective Dan',
    description: 'Detective Dan - Classroom6x unblocked game',
    url: 'Classroom6x/class-320.html',
    thumbnail: 'thumbnail/class-320.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-321',
    title: 'Dino Bros',
    description: 'Dino Bros - Classroom6x unblocked game',
    url: 'Classroom6x/class-321.html',
    thumbnail: 'thumbnail/class-321.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-322',
    title: 'Merge Party',
    description: 'Merge Party - Classroom6x unblocked game',
    url: 'Classroom6x/class-322.html',
    thumbnail: 'thumbnail/class-322.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-323',
    title: 'Scrap Divers',
    description: 'Scrap Divers - Classroom6x unblocked game',
    url: 'Classroom6x/class-323.html',
    thumbnail: 'thumbnail/class-323.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-325',
    title: 'IZOWAVE - Build and Defend',
    description: 'IZOWAVE - Build and Defend - Classroom6x unblocked game',
    url: 'Classroom6x/class-325.html',
    thumbnail: 'thumbnail/class-325.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-326',
    title: 'Pack a bag',
    description: 'Pack a bag - Classroom6x unblocked game',
    url: 'Classroom6x/class-326.html',
    thumbnail: 'thumbnail/class-326.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-327',
    title: 'Cozy Room Design',
    description: 'Cozy Room Design - Classroom6x unblocked game',
    url: 'Classroom6x/class-327.html',
    thumbnail: 'thumbnail/class-327.png',
    category: '3D'
  },
  {
    id: 'classroom6x-328',
    title: 'RunMan: Race Around the World',
    description: 'RunMan: Race Around the World - Classroom6x unblocked game',
    url: 'Classroom6x/class-328.html',
    thumbnail: 'thumbnail/class-328.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-329',
    title: 'Idle Zoo Safari Rescue',
    description: 'Idle Zoo Safari Rescue - Classroom6x unblocked game',
    url: 'Classroom6x/class-329.html',
    thumbnail: 'thumbnail/class-329.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-330',
    title: 'Blobby Clicker',
    description: 'Blobby Clicker - Classroom6x unblocked game',
    url: 'Classroom6x/class-330.html',
    thumbnail: 'thumbnail/class-330.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-331',
    title: 'Orange',
    description: 'Orange - Classroom6x unblocked game',
    url: 'Classroom6x/class-331.html',
    thumbnail: 'thumbnail/class-331.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-332',
    title: 'Craftomation 1',
    description: 'Craftomation 1 - Classroom6x unblocked game',
    url: 'Classroom6x/class-332.html',
    thumbnail: 'thumbnail/class-332.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-333',
    title: 'Basketball Frvr',
    description: 'Basketball Frvr - Classroom6x unblocked game',
    url: 'Classroom6x/class-333.html',
    thumbnail: 'thumbnail/class-333.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-334',
    title: 'Bacon May Die',
    description: 'Bacon May Die - Classroom6x unblocked game',
    url: 'Classroom6x/class-334.html',
    thumbnail: 'thumbnail/class-334.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-335',
    title: 'Flip Runner',
    description: 'Flip Runner - Classroom6x unblocked game',
    url: 'Classroom6x/class-335.html',
    thumbnail: 'thumbnail/class-335.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-336',
    title: 'Super Mx The Champion',
    description: 'Super Mx The Champion - Classroom6x unblocked game',
    url: 'Classroom6x/class-336.html',
    thumbnail: 'thumbnail/class-336.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-337',
    title: 'Slot Car Racing',
    description: 'Slot Car Racing - Classroom6x unblocked game',
    url: 'Classroom6x/class-337.html',
    thumbnail: 'thumbnail/class-337.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-338',
    title: 'Dragon Simulator 3D',
    description: 'Dragon Simulator 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-338.html',
    thumbnail: 'thumbnail/class-338.png',
    category: '3D'
  },
  {
    id: 'classroom6x-339',
    title: 'Fox Simulator 3D',
    description: 'Fox Simulator 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-339.html',
    thumbnail: 'thumbnail/class-339.png',
    category: '3D'
  },
  {
    id: 'classroom6x-340',
    title: 'Archer Master 3D Castle Defense',
    description: 'Archer Master 3D Castle Defense - Classroom6x unblocked game',
    url: 'Classroom6x/class-340.html',
    thumbnail: 'thumbnail/class-340.png',
    category: '3D'
  },
  {
    id: 'classroom6x-341',
    title: 'Fireboy and Watergirl 6: Fairy Tales',
    description: 'Fireboy and Watergirl 6: Fairy Tales - Classroom6x unblocked game',
    url: 'Classroom6x/class-341.html',
    thumbnail: 'thumbnail/class-341.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-342',
    title: 'Fireboy and Watergirl 5: Elements',
    description: 'Fireboy and Watergirl 5: Elements - Classroom6x unblocked game',
    url: 'Classroom6x/class-342.html',
    thumbnail: 'thumbnail/class-342.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-343',
    title: 'Fireboy and Watergirl 4: Crystal Temple',
    description: 'Fireboy and Watergirl 4: Crystal Temple - Classroom6x unblocked game',
    url: 'Classroom6x/class-343.html',
    thumbnail: 'thumbnail/class-343.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-344',
    title: 'Fireboy and Watergirl 3: Ice Temple',
    description: 'Fireboy and Watergirl 3: Ice Temple - Classroom6x unblocked game',
    url: 'Classroom6x/class-344.html',
    thumbnail: 'thumbnail/class-344.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-345',
    title: 'Fireboy and Watergirl 2: Light Temple',
    description: 'Fireboy and Watergirl 2: Light Temple - Classroom6x unblocked game',
    url: 'Classroom6x/class-345.html',
    thumbnail: 'thumbnail/class-345.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-346',
    title: 'Fireboy and Watergirl 1: Forest Temple',
    description: 'Fireboy and Watergirl 1: Forest Temple - Classroom6x unblocked game',
    url: 'Classroom6x/class-346.html',
    thumbnail: 'thumbnail/class-346.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-347',
    title: 'Friday Night Funkin vs Shaggy x Matt',
    description: 'Friday Night Funkin vs Shaggy x Matt - Classroom6x unblocked game',
    url: 'Classroom6x/class-347.html',
    thumbnail: 'thumbnail/class-347.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-348',
    title: 'Friday Night Funkin B-Sides',
    description: 'Friday Night Funkin B-Sides - Classroom6x unblocked game',
    url: 'Classroom6x/class-348.html',
    thumbnail: 'thumbnail/class-348.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-349',
    title: 'Friday Night Funkin vs Hatsune Miku',
    description: 'Friday Night Funkin vs Hatsune Miku - Classroom6x unblocked game',
    url: 'Classroom6x/class-349.html',
    thumbnail: 'thumbnail/class-349.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-350',
    title: 'Friday Night Funkin vs XE',
    description: 'Friday Night Funkin vs XE - Classroom6x unblocked game',
    url: 'Classroom6x/class-350.html',
    thumbnail: 'thumbnail/class-350.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-351',
    title: 'Zeepkist: Crash 2D',
    description: 'Zeepkist: Crash 2D - Classroom6x unblocked game',
    url: 'Classroom6x/class-351.html',
    thumbnail: 'thumbnail/class-351.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-352',
    title: 'Avalanche',
    description: 'Avalanche - Classroom6x unblocked game',
    url: 'Classroom6x/class-352.html',
    thumbnail: 'thumbnail/class-352.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-354',
    title: 'Slalom Hero',
    description: 'Slalom Hero - Classroom6x unblocked game',
    url: 'Classroom6x/class-354.html',
    thumbnail: 'thumbnail/class-354.png',
    category: '3D'
  },
  {
    id: 'classroom6x-355',
    title: 'Retro Highway',
    description: 'Retro Highway - Classroom6x unblocked game',
    url: 'Classroom6x/class-355.html',
    thumbnail: 'thumbnail/class-355.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-356',
    title: 'Level Devil',
    description: 'Level Devil - Classroom6x unblocked game',
    url: 'Classroom6x/class-356.html',
    thumbnail: 'thumbnail/class-356.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-357',
    title: 'Traffic Escape',
    description: 'Traffic Escape - Classroom6x unblocked game',
    url: 'Classroom6x/class-357.html',
    thumbnail: 'thumbnail/class-357.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-358',
    title: 'Flip Bros',
    description: 'Flip Bros - Classroom6x unblocked game',
    url: 'Classroom6x/class-358.html',
    thumbnail: 'thumbnail/class-358.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-359',
    title: 'Hills Of Steel',
    description: 'Hills Of Steel - Classroom6x unblocked game',
    url: 'Classroom6x/class-359.html',
    thumbnail: 'thumbnail/class-359.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-360',
    title: 'Car Eats Car: Winter Adventure',
    description: 'Car Eats Car: Winter Adventure - Classroom6x unblocked game',
    url: 'Classroom6x/class-360.html',
    thumbnail: 'thumbnail/class-360.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-361',
    title: 'Supernova',
    description: 'Supernova - Classroom6x unblocked game',
    url: 'Classroom6x/class-361.html',
    thumbnail: 'thumbnail/class-361.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-362',
    title: 'Catpad',
    description: 'Catpad - Classroom6x unblocked game',
    url: 'Classroom6x/class-362.html',
    thumbnail: 'thumbnail/class-362.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-363',
    title: 'Blumgi Dragon',
    description: 'Blumgi Dragon - Classroom6x unblocked game',
    url: 'Classroom6x/class-363.html',
    thumbnail: 'thumbnail/class-363.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-364',
    title: 'Tag 2',
    description: 'Tag 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-364.html',
    thumbnail: 'thumbnail/class-364.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-365',
    title: 'Stickman crazy box',
    description: 'Stickman crazy box - Classroom6x unblocked game',
    url: 'Classroom6x/class-365.html',
    thumbnail: 'thumbnail/class-365.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-366',
    title: 'G-switch 4',
    description: 'G-switch 4 - Classroom6x unblocked game',
    url: 'Classroom6x/class-366.html',
    thumbnail: 'thumbnail/class-366.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-367',
    title: 'Superbrawl',
    description: 'Superbrawl - Classroom6x unblocked game',
    url: 'Classroom6x/class-367.html',
    thumbnail: 'thumbnail/class-367.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-368',
    title: 'Make it meme',
    description: 'Make it meme - Classroom6x unblocked game',
    url: 'Classroom6x/class-368.html',
    thumbnail: 'thumbnail/class-368.png',
    category: 'Multiplayer'
  },
  {
    id: 'classroom6x-369',
    title: 'Dunk perfect',
    description: 'Dunk perfect - Classroom6x unblocked game',
    url: 'Classroom6x/class-369.html',
    thumbnail: 'thumbnail/class-369.png',
    category: '3D'
  },
  {
    id: 'classroom6x-370',
    title: '2 minute football',
    description: '2 minute football - Classroom6x unblocked game',
    url: 'Classroom6x/class-370.html',
    thumbnail: 'thumbnail/class-370.png',
    category: '3D'
  },
  {
    id: 'classroom6x-372',
    title: 'Sharkio',
    description: 'Sharkio - Classroom6x unblocked game',
    url: 'Classroom6x/class-372.html',
    thumbnail: 'thumbnail/class-372.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-373',
    title: 'Tetra Blocks',
    description: 'Tetra Blocks - Classroom6x unblocked game',
    url: 'Classroom6x/class-373.html',
    thumbnail: 'thumbnail/class-373.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-374',
    title: 'Mystical Birdlink',
    description: 'Mystical Birdlink - Classroom6x unblocked game',
    url: 'Classroom6x/class-374.html',
    thumbnail: 'thumbnail/class-374.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-375',
    title: 'Bubbles cool',
    description: 'Bubbles cool - Classroom6x unblocked game',
    url: 'Classroom6x/class-375.html',
    thumbnail: 'thumbnail/class-375.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-376',
    title: 'James Gun',
    description: 'James Gun - Classroom6x unblocked game',
    url: 'Classroom6x/class-376.html',
    thumbnail: 'thumbnail/class-376.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-377',
    title: 'Descent',
    description: 'Descent - Classroom6x unblocked game',
    url: 'Classroom6x/class-377.html',
    thumbnail: 'thumbnail/class-377.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-378',
    title: 'Fury wars',
    description: 'Fury wars - Classroom6x unblocked game',
    url: 'Classroom6x/class-378.html',
    thumbnail: 'thumbnail/class-378.png',
    category: '3D'
  },
  {
    id: 'classroom6x-379',
    title: 'Shady Bears',
    description: 'Shady Bears - Classroom6x unblocked game',
    url: 'Classroom6x/class-379.html',
    thumbnail: 'thumbnail/class-379.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-380',
    title: 'Football Blitz',
    description: 'Football Blitz - Classroom6x unblocked game',
    url: 'Classroom6x/class-380.html',
    thumbnail: 'thumbnail/class-380.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-381',
    title: 'Touchdowners',
    description: 'Touchdowners - Classroom6x unblocked game',
    url: 'Classroom6x/class-381.html',
    thumbnail: 'thumbnail/class-381.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-382',
    title: 'Slime Laboratory',
    description: 'Slime Laboratory - Classroom6x unblocked game',
    url: 'Classroom6x/class-382.html',
    thumbnail: 'thumbnail/class-382.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-383',
    title: 'Battle golf',
    description: 'Battle golf - Classroom6x unblocked game',
    url: 'Classroom6x/class-383.html',
    thumbnail: 'thumbnail/class-383.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-384',
    title: 'Four in a Row',
    description: 'Four in a Row - Classroom6x unblocked game',
    url: 'Classroom6x/class-384.html',
    thumbnail: 'thumbnail/class-384.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-385',
    title: 'Two Button Bounce',
    description: 'Two Button Bounce - Classroom6x unblocked game',
    url: 'Classroom6x/class-385.html',
    thumbnail: 'thumbnail/class-385.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-386',
    title: 'Little Master Cricket',
    description: 'Little Master Cricket - Classroom6x unblocked game',
    url: 'Classroom6x/class-386.html',
    thumbnail: 'thumbnail/class-386.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-387',
    title: 'Snake.is MLG Edition',
    description: 'Snake.is MLG Edition - Classroom6x unblocked game',
    url: 'Classroom6x/class-387.html',
    thumbnail: 'thumbnail/class-387.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-388',
    title: 'Misland',
    description: 'Misland - Classroom6x unblocked game',
    url: 'Classroom6x/class-388.html',
    thumbnail: 'thumbnail/class-388.png',
    category: '3D'
  },
  {
    id: 'classroom6x-389',
    title: 'Village Craft',
    description: 'Village Craft - Classroom6x unblocked game',
    url: 'Classroom6x/class-389.html',
    thumbnail: 'thumbnail/class-389.png',
    category: '3D'
  },
  {
    id: 'classroom6x-390',
    title: 'Odd Bot Out',
    description: 'Odd Bot Out - Classroom6x unblocked game',
    url: 'Classroom6x/class-390.html',
    thumbnail: 'thumbnail/class-390.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-391',
    title: 'Hide and Smash',
    description: 'Hide and Smash - Classroom6x unblocked game',
    url: 'Classroom6x/class-391.html',
    thumbnail: 'thumbnail/class-391.png',
    category: '3D'
  },
  {
    id: 'classroom6x-392',
    title: 'Skibidi Shooter',
    description: 'Skibidi Shooter - Classroom6x unblocked game',
    url: 'Classroom6x/class-392.html',
    thumbnail: 'thumbnail/class-392.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-393',
    title: 'Traffic Rush',
    description: 'Traffic Rush - Classroom6x unblocked game',
    url: 'Classroom6x/class-393.html',
    thumbnail: 'thumbnail/class-393.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-394',
    title: 'Shootz',
    description: 'Shootz - Classroom6x unblocked game',
    url: 'Classroom6x/class-394.html',
    thumbnail: 'thumbnail/class-394.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-395',
    title: 'Kart Wars',
    description: 'Kart Wars - Classroom6x unblocked game',
    url: 'Classroom6x/class-395.html',
    thumbnail: 'thumbnail/class-395.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-396',
    title: 'Noob Hook',
    description: 'Noob Hook - Classroom6x unblocked game',
    url: 'Classroom6x/class-396.html',
    thumbnail: 'thumbnail/class-396.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-398',
    title: 'Hypersnake',
    description: 'Hypersnake - Classroom6x unblocked game',
    url: 'Classroom6x/class-398.html',
    thumbnail: 'thumbnail/class-398.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-399',
    title: 'Slopey',
    description: 'Slopey - Classroom6x unblocked game',
    url: 'Classroom6x/class-399.html',
    thumbnail: 'thumbnail/class-399.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-400',
    title: 'Retro Bowl',
    description: 'Retro Bowl - Classroom6x unblocked game',
    url: 'Classroom6x/class-400.html',
    thumbnail: 'thumbnail/class-400.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-401',
    title: 'Drive Mad',
    description: 'Drive Mad - Classroom6x unblocked game',
    url: 'Classroom6x/class-401.html',
    thumbnail: 'thumbnail/class-401.png',
    category: '3D'
  },
  {
    id: 'classroom6x-402',
    title: 'Crossy Road',
    description: 'Crossy Road - Classroom6x unblocked game',
    url: 'Classroom6x/class-402.html',
    thumbnail: 'thumbnail/class-402.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-403',
    title: 'G Switch 3',
    description: 'G Switch 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-403.html',
    thumbnail: 'thumbnail/class-403.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-404',
    title: 'Tunnel Rush',
    description: 'Tunnel Rush - Classroom6x unblocked game',
    url: 'Classroom6x/class-404.html',
    thumbnail: 'thumbnail/class-404.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-405',
    title: 'Temple Run 2',
    description: 'Temple Run 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-405.html',
    thumbnail: 'thumbnail/class-405.png',
    category: '3D'
  },
  {
    id: 'classroom6x-406',
    title: 'Stickman Hook',
    description: 'Stickman Hook - Classroom6x unblocked game',
    url: 'Classroom6x/class-406.html',
    thumbnail: 'thumbnail/class-406.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-407',
    title: 'Doodle Jump',
    description: 'Doodle Jump - Classroom6x unblocked game',
    url: 'Classroom6x/class-407.html',
    thumbnail: 'thumbnail/class-407.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-408',
    title: 'Raft Wars 2',
    description: 'Raft Wars 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-408.html',
    thumbnail: 'thumbnail/class-408.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-409',
    title: 'Raft Wars',
    description: 'Raft Wars - Classroom6x unblocked game',
    url: 'Classroom6x/class-409.html',
    thumbnail: 'thumbnail/class-409.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-410',
    title: 'Stick Merge',
    description: 'Stick Merge - Classroom6x unblocked game',
    url: 'Classroom6x/class-410.html',
    thumbnail: 'thumbnail/class-410.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-411',
    title: 'Temple Of Boom',
    description: 'Temple Of Boom - Classroom6x unblocked game',
    url: 'Classroom6x/class-411.html',
    thumbnail: 'thumbnail/class-411.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-412',
    title: 'Dreadhead Parkour',
    description: 'Dreadhead Parkour - Classroom6x unblocked game',
    url: 'Classroom6x/class-412.html',
    thumbnail: 'thumbnail/class-412.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-413',
    title: 'Blumgi Rocket',
    description: 'Blumgi Rocket - Classroom6x unblocked game',
    url: 'Classroom6x/class-413.html',
    thumbnail: 'thumbnail/class-413.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-414',
    title: 'Monster Tracks',
    description: 'Monster Tracks - Classroom6x unblocked game',
    url: 'Classroom6x/class-414.html',
    thumbnail: 'thumbnail/class-414.png',
    category: '3D'
  },
  {
    id: 'classroom6x-415',
    title: 'Sausage Flip',
    description: 'Sausage Flip - Classroom6x unblocked game',
    url: 'Classroom6x/class-415.html',
    thumbnail: 'thumbnail/class-415.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-416',
    title: 'Stick Defenders',
    description: 'Stick Defenders - Classroom6x unblocked game',
    url: 'Classroom6x/class-416.html',
    thumbnail: 'thumbnail/class-416.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-417',
    title: 'Stacktris',
    description: 'Stacktris - Classroom6x unblocked game',
    url: 'Classroom6x/class-417.html',
    thumbnail: 'thumbnail/class-417.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-418',
    title: 'Brain Test 3: Tricky Quests',
    description: 'Brain Test 3: Tricky Quests - Classroom6x unblocked game',
    url: 'Classroom6x/class-418.html',
    thumbnail: 'thumbnail/class-418.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-419',
    title: 'Blumgi Ball',
    description: 'Blumgi Ball - Classroom6x unblocked game',
    url: 'Classroom6x/class-419.html',
    thumbnail: 'thumbnail/class-419.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-420',
    title: 'Gobble',
    description: 'Gobble - Classroom6x unblocked game',
    url: 'Classroom6x/class-420.html',
    thumbnail: 'thumbnail/class-420.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-421',
    title: 'Blumgi Slime',
    description: 'Blumgi Slime - Classroom6x unblocked game',
    url: 'Classroom6x/class-421.html',
    thumbnail: 'thumbnail/class-421.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-422',
    title: 'Brain Test: Tricky Puzzles',
    description: 'Brain Test: Tricky Puzzles - Classroom6x unblocked game',
    url: 'Classroom6x/class-422.html',
    thumbnail: 'thumbnail/class-422.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-423',
    title: 'Soccer Skills World Cup',
    description: 'Soccer Skills World Cup - Classroom6x unblocked game',
    url: 'Classroom6x/class-423.html',
    thumbnail: 'thumbnail/class-423.png',
    category: '3D'
  },
  {
    id: 'classroom6x-424',
    title: 'Rooftop Snipers 2',
    description: 'Rooftop Snipers 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-424.html',
    thumbnail: 'thumbnail/class-424.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-425',
    title: 'Burger Bounty',
    description: 'Burger Bounty - Classroom6x unblocked game',
    url: 'Classroom6x/class-425.html',
    thumbnail: 'thumbnail/class-425.png',
    category: '3D'
  },
  {
    id: 'classroom6x-426',
    title: 'Stickman Climb 2',
    description: 'Stickman Climb 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-426.html',
    thumbnail: 'thumbnail/class-426.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-427',
    title: 'Blumgi Castle',
    description: 'Blumgi Castle - Classroom6x unblocked game',
    url: 'Classroom6x/class-427.html',
    thumbnail: 'thumbnail/class-427.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-428',
    title: 'Thumb Fighter Christmas',
    description: 'Thumb Fighter Christmas - Classroom6x unblocked game',
    url: 'Classroom6x/class-428.html',
    thumbnail: 'thumbnail/class-428.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-429',
    title: 'Soccer Skills Euro Cup',
    description: 'Soccer Skills Euro Cup - Classroom6x unblocked game',
    url: 'Classroom6x/class-429.html',
    thumbnail: 'thumbnail/class-429.png',
    category: '3D'
  },
  {
    id: 'classroom6x-430',
    title: 'Throw it higher',
    description: 'Throw it higher - Classroom6x unblocked game',
    url: 'Classroom6x/class-430.html',
    thumbnail: 'thumbnail/class-430.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-431',
    title: 'Vectaria io',
    description: 'Vectaria io - Classroom6x unblocked game',
    url: 'Classroom6x/class-431.html',
    thumbnail: 'thumbnail/class-431.png',
    category: '3D'
  },
  {
    id: 'classroom6x-432',
    title: 'Narrow one',
    description: 'Narrow one - Classroom6x unblocked game',
    url: 'Classroom6x/class-432.html',
    thumbnail: 'thumbnail/class-432.png',
    category: '3D'
  },
  {
    id: 'classroom6x-434',
    title: 'Flappy Bird Origin',
    description: 'Flappy Bird Origin - Classroom6x unblocked game',
    url: 'Classroom6x/class-434.html',
    thumbnail: 'thumbnail/class-434.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-435',
    title: 'Flappy Bird',
    description: 'Flappy Bird - Classroom6x unblocked game',
    url: 'Classroom6x/class-435.html',
    thumbnail: 'thumbnail/class-435.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-436',
    title: 'Basket Random',
    description: 'Basket Random - Classroom6x unblocked game',
    url: 'Classroom6x/class-436.html',
    thumbnail: 'thumbnail/class-436.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-437',
    title: 'Slope 2',
    description: 'Slope 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-437.html',
    thumbnail: 'thumbnail/class-437.png',
    category: '3D'
  },
  {
    id: 'classroom6x-438',
    title: 'Tomb Of The Mask',
    description: 'Tomb Of The Mask - Classroom6x unblocked game',
    url: 'Classroom6x/class-438.html',
    thumbnail: 'thumbnail/class-438.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-439',
    title: '1v1 Lol',
    description: '1v1 Lol - Classroom6x unblocked game',
    url: 'Classroom6x/class-439.html',
    thumbnail: 'thumbnail/class-439.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-440',
    title: '1v1 LOL Offline',
    description: '1v1 LOL Offline - Classroom6x unblocked game',
    url: 'Classroom6x/class-440.html',
    thumbnail: 'thumbnail/class-440.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-441',
    title: 'Bitlife',
    description: 'Bitlife - Classroom6x unblocked game',
    url: 'Classroom6x/class-441.html',
    thumbnail: 'thumbnail/class-441.png',
    category: 'Simulation'
  },
  {
    id: 'classroom6x-442',
    title: 'Subway Surfers Sanfransisco',
    description: 'Subway Surfers Sanfransisco - Classroom6x unblocked game',
    url: 'Classroom6x/class-442.html',
    thumbnail: 'thumbnail/class-442.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-443',
    title: 'Subway Surfers Beijing',
    description: 'Subway Surfers Beijing - Classroom6x unblocked game',
    url: 'Classroom6x/class-443.html',
    thumbnail: 'thumbnail/class-443.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-444',
    title: 'Subway Surfers Newyork',
    description: 'Subway Surfers Newyork - Classroom6x unblocked game',
    url: 'Classroom6x/class-444.html',
    thumbnail: 'thumbnail/class-444.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-445',
    title: 'Subway Surfers Houston',
    description: 'Subway Surfers Houston - Classroom6x unblocked game',
    url: 'Classroom6x/class-445.html',
    thumbnail: 'thumbnail/class-445.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-446',
    title: 'Subway Surfers Monaco',
    description: 'Subway Surfers Monaco - Classroom6x unblocked game',
    url: 'Classroom6x/class-446.html',
    thumbnail: 'thumbnail/class-446.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-447',
    title: 'Drift Hunters',
    description: 'Drift Hunters - Classroom6x unblocked game',
    url: 'Classroom6x/class-447.html',
    thumbnail: 'thumbnail/class-447.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-448',
    title: 'Cookie Clicker',
    description: 'Cookie Clicker - Classroom6x unblocked game',
    url: 'Classroom6x/class-448.html',
    thumbnail: 'thumbnail/class-448.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-449',
    title: 'Basketball Stars',
    description: 'Basketball Stars - Classroom6x unblocked game',
    url: 'Classroom6x/class-449.html',
    thumbnail: 'thumbnail/class-449.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-450',
    title: 'Slope',
    description: 'Slope - Classroom6x unblocked game',
    url: 'Classroom6x/class-450.html',
    thumbnail: 'thumbnail/class-450.png',
    category: '3D'
  },
  {
    id: 'classroom6x-451',
    title: 'Tiny Fishing',
    description: 'Tiny Fishing - Classroom6x unblocked game',
    url: 'Classroom6x/class-451.html',
    thumbnail: 'thumbnail/class-451.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-452',
    title: '2048',
    description: '2048 - Classroom6x unblocked game',
    url: 'Classroom6x/class-452.html',
    thumbnail: 'thumbnail/class-452.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-453',
    title: 'Geometry Dash',
    description: 'Geometry Dash - Classroom6x unblocked game',
    url: 'Classroom6x/class-453.html',
    thumbnail: 'thumbnail/class-453.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-454',
    title: 'Google Snake',
    description: 'Google Snake - Classroom6x unblocked game',
    url: 'Classroom6x/class-454.html',
    thumbnail: 'thumbnail/class-454.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-455',
    title: 'Tetris Flash',
    description: 'Tetris Flash - Classroom6x unblocked game',
    url: 'Classroom6x/class-455.html',
    thumbnail: 'thumbnail/class-455.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-456',
    title: 'Ovo',
    description: 'Ovo - Classroom6x unblocked game',
    url: 'Classroom6x/class-456.html',
    thumbnail: 'thumbnail/class-456.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-458',
    title: 'Moto X3m',
    description: 'Moto X3m - Classroom6x unblocked game',
    url: 'Classroom6x/class-458.html',
    thumbnail: 'thumbnail/class-458.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-459',
    title: 'Moto X3m 2',
    description: 'Moto X3m 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-459.html',
    thumbnail: 'thumbnail/class-459.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-460',
    title: 'Moto X3m Winter',
    description: 'Moto X3m Winter - Classroom6x unblocked game',
    url: 'Classroom6x/class-460.html',
    thumbnail: 'thumbnail/class-460.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-461',
    title: 'Moto X3m Spooky Land',
    description: 'Moto X3m Spooky Land - Classroom6x unblocked game',
    url: 'Classroom6x/class-461.html',
    thumbnail: 'thumbnail/class-461.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-462',
    title: 'Moto X3m Pool Party',
    description: 'Moto X3m Pool Party - Classroom6x unblocked game',
    url: 'Classroom6x/class-462.html',
    thumbnail: 'thumbnail/class-462.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-463',
    title: 'Eggy Car',
    description: 'Eggy Car - Classroom6x unblocked game',
    url: 'Classroom6x/class-463.html',
    thumbnail: 'thumbnail/class-463.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-464',
    title: 'Moto Road Rash 3D',
    description: 'Moto Road Rash 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-464.html',
    thumbnail: 'thumbnail/class-464.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-465',
    title: 'Minesweeper',
    description: 'Minesweeper - Classroom6x unblocked game',
    url: 'Classroom6x/class-465.html',
    thumbnail: 'thumbnail/class-465.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-466',
    title: 'Solitaire',
    description: 'Solitaire - Classroom6x unblocked game',
    url: 'Classroom6x/class-466.html',
    thumbnail: 'thumbnail/class-466.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-467',
    title: 'Dinosaur Game',
    description: 'Dinosaur Game - Classroom6x unblocked game',
    url: 'Classroom6x/class-467.html',
    thumbnail: 'thumbnail/class-467.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-468',
    title: 'Among Us',
    description: 'Among Us - Classroom6x unblocked game',
    url: 'Classroom6x/class-468.html',
    thumbnail: 'thumbnail/class-468.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-469',
    title: 'Wordle Unlimited',
    description: 'Wordle Unlimited - Classroom6x unblocked game',
    url: 'Classroom6x/class-469.html',
    thumbnail: 'thumbnail/class-469.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-470',
    title: 'Five Nights at Freddy\'s',
    description: 'Five Nights at Freddy\'s - Classroom6x unblocked game',
    url: 'Classroom6x/class-470.html',
    thumbnail: 'thumbnail/class-470.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-471',
    title: 'Bubble Shooter',
    description: 'Bubble Shooter - Classroom6x unblocked game',
    url: 'Classroom6x/class-471.html',
    thumbnail: 'thumbnail/class-471.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-472',
    title: 'Drift Boss',
    description: 'Drift Boss - Classroom6x unblocked game',
    url: 'Classroom6x/class-472.html',
    thumbnail: 'thumbnail/class-472.png',
    category: '3D'
  },
  {
    id: 'classroom6x-473',
    title: 'Google Feud',
    description: 'Google Feud - Classroom6x unblocked game',
    url: 'Classroom6x/class-473.html',
    thumbnail: 'thumbnail/class-473.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-474',
    title: 'Basketball Legends',
    description: 'Basketball Legends - Classroom6x unblocked game',
    url: 'Classroom6x/class-474.html',
    thumbnail: 'thumbnail/class-474.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-475',
    title: '8 Ball Pool',
    description: '8 Ball Pool - Classroom6x unblocked game',
    url: 'Classroom6x/class-475.html',
    thumbnail: 'thumbnail/class-475.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-476',
    title: 'Doge Miner',
    description: 'Doge Miner - Classroom6x unblocked game',
    url: 'Classroom6x/class-476.html',
    thumbnail: 'thumbnail/class-476.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-477',
    title: 'Duck Life',
    description: 'Duck Life - Classroom6x unblocked game',
    url: 'Classroom6x/class-477.html',
    thumbnail: 'thumbnail/class-477.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-478',
    title: 'Duck Life 4',
    description: 'Duck Life 4 - Classroom6x unblocked game',
    url: 'Classroom6x/class-478.html',
    thumbnail: 'thumbnail/class-478.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-479',
    title: 'Getaway Shootout',
    description: 'Getaway Shootout - Classroom6x unblocked game',
    url: 'Classroom6x/class-479.html',
    thumbnail: 'thumbnail/class-479.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-480',
    title: 'The Impossible Quiz',
    description: 'The Impossible Quiz - Classroom6x unblocked game',
    url: 'Classroom6x/class-480.html',
    thumbnail: 'thumbnail/class-480.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-481',
    title: 'Rooftop Snipers',
    description: 'Rooftop Snipers - Classroom6x unblocked game',
    url: 'Classroom6x/class-481.html',
    thumbnail: 'thumbnail/class-481.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-482',
    title: 'Basket Bros',
    description: 'Basket Bros - Classroom6x unblocked game',
    url: 'Classroom6x/class-482.html',
    thumbnail: 'thumbnail/class-482.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-483',
    title: 'Jetpack Joyride',
    description: 'Jetpack Joyride - Classroom6x unblocked game',
    url: 'Classroom6x/class-483.html',
    thumbnail: 'thumbnail/class-483.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-484',
    title: 'Rolly Vortex',
    description: 'Rolly Vortex - Classroom6x unblocked game',
    url: 'Classroom6x/class-484.html',
    thumbnail: 'thumbnail/class-484.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-485',
    title: 'We Become What We Behold',
    description: 'We Become What We Behold - Classroom6x unblocked game',
    url: 'Classroom6x/class-485.html',
    thumbnail: 'thumbnail/class-485.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-487',
    title: 'Idle Breakout',
    description: 'Idle Breakout - Classroom6x unblocked game',
    url: 'Classroom6x/class-487.html',
    thumbnail: 'thumbnail/class-487.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-488',
    title: 'Tanuki Sunset',
    description: 'Tanuki Sunset - Classroom6x unblocked game',
    url: 'Classroom6x/class-488.html',
    thumbnail: 'thumbnail/class-488.png',
    category: '3D'
  },
  {
    id: 'classroom6x-489',
    title: 'Bullet Force',
    description: 'Bullet Force - Classroom6x unblocked game',
    url: 'Classroom6x/class-489.html',
    thumbnail: 'thumbnail/class-489.png',
    category: '3D'
  },
  {
    id: 'classroom6x-490',
    title: 'House Of Hazards',
    description: 'House Of Hazards - Classroom6x unblocked game',
    url: 'Classroom6x/class-490.html',
    thumbnail: 'thumbnail/class-490.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-491',
    title: 'Red Ball 4',
    description: 'Red Ball 4 - Classroom6x unblocked game',
    url: 'Classroom6x/class-491.html',
    thumbnail: 'thumbnail/class-491.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-492',
    title: 'Age Of War',
    description: 'Age Of War - Classroom6x unblocked game',
    url: 'Classroom6x/class-492.html',
    thumbnail: 'thumbnail/class-492.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-493',
    title: 'Vex 5',
    description: 'Vex 5 - Classroom6x unblocked game',
    url: 'Classroom6x/class-493.html',
    thumbnail: 'thumbnail/class-493.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-494',
    title: 'Cat Trap',
    description: 'Cat Trap - Classroom6x unblocked game',
    url: 'Classroom6x/class-494.html',
    thumbnail: 'thumbnail/class-494.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-495',
    title: 'Fancy Pants',
    description: 'Fancy Pants - Classroom6x unblocked game',
    url: 'Classroom6x/class-495.html',
    thumbnail: 'thumbnail/class-495.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-496',
    title: 'Super Hot',
    description: 'Super Hot - Classroom6x unblocked game',
    url: 'Classroom6x/class-496.html',
    thumbnail: 'thumbnail/class-496.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-497',
    title: 'Curve Ball 3D',
    description: 'Curve Ball 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-497.html',
    thumbnail: 'thumbnail/class-497.png',
    category: '3D'
  },
  {
    id: 'classroom6x-498',
    title: 'A Dance Of Fire And Ice',
    description: 'A Dance Of Fire And Ice - Classroom6x unblocked game',
    url: 'Classroom6x/class-498.html',
    thumbnail: 'thumbnail/class-498.png',
    category: '3D'
  },
  {
    id: 'classroom6x-499',
    title: 'Stack',
    description: 'Stack - Classroom6x unblocked game',
    url: 'Classroom6x/class-499.html',
    thumbnail: 'thumbnail/class-499.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-500',
    title: 'Elastic Man',
    description: 'Elastic Man - Classroom6x unblocked game',
    url: 'Classroom6x/class-500.html',
    thumbnail: 'thumbnail/class-500.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-501',
    title: 'Slope 3',
    description: 'Slope 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-501.html',
    thumbnail: 'thumbnail/class-501.png',
    category: '3D'
  },
  {
    id: 'classroom6x-502',
    title: 'Deepest Sword',
    description: 'Deepest Sword - Classroom6x unblocked game',
    url: 'Classroom6x/class-502.html',
    thumbnail: 'thumbnail/class-502.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-503',
    title: 'There Is No Game',
    description: 'There Is No Game - Classroom6x unblocked game',
    url: 'Classroom6x/class-503.html',
    thumbnail: 'thumbnail/class-503.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-504',
    title: 'Scrap Metal',
    description: 'Scrap Metal - Classroom6x unblocked game',
    url: 'Classroom6x/class-504.html',
    thumbnail: 'thumbnail/class-504.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-505',
    title: 'Paper Io 2',
    description: 'Paper Io 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-505.html',
    thumbnail: 'thumbnail/class-505.png',
    category: 'Multiplayer'
  },
  {
    id: 'classroom6x-506',
    title: 'Master Chess',
    description: 'Master Chess - Classroom6x unblocked game',
    url: 'Classroom6x/class-506.html',
    thumbnail: 'thumbnail/class-506.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-507',
    title: 'Happy Room',
    description: 'Happy Room - Classroom6x unblocked game',
    url: 'Classroom6x/class-507.html',
    thumbnail: 'thumbnail/class-507.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-508',
    title: 'Worlds Hardest Game 2',
    description: 'Worlds Hardest Game 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-508.html',
    thumbnail: 'thumbnail/class-508.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-509',
    title: 'Car Rush',
    description: 'Car Rush - Classroom6x unblocked game',
    url: 'Classroom6x/class-509.html',
    thumbnail: 'thumbnail/class-509.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-510',
    title: 'Vex 7',
    description: 'Vex 7 - Classroom6x unblocked game',
    url: 'Classroom6x/class-510.html',
    thumbnail: 'thumbnail/class-510.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-511',
    title: 'Soccer Random',
    description: 'Soccer Random - Classroom6x unblocked game',
    url: 'Classroom6x/class-511.html',
    thumbnail: 'thumbnail/class-511.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-512',
    title: 'Jelly Truck',
    description: 'Jelly Truck - Classroom6x unblocked game',
    url: 'Classroom6x/class-512.html',
    thumbnail: 'thumbnail/class-512.png',
    category: 'Racing'
  },
  {
    id: 'classroom6x-513',
    title: 'Gun Mayhem 2',
    description: 'Gun Mayhem 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-513.html',
    thumbnail: 'thumbnail/class-513.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-514',
    title: 'Awesome Tanks 2',
    description: 'Awesome Tanks 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-514.html',
    thumbnail: 'thumbnail/class-514.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-515',
    title: 'Parking Fury',
    description: 'Parking Fury - Classroom6x unblocked game',
    url: 'Classroom6x/class-515.html',
    thumbnail: 'thumbnail/class-515.png',
    category: '3D'
  },
  {
    id: 'classroom6x-516',
    title: 'Electron Dash',
    description: 'Electron Dash - Classroom6x unblocked game',
    url: 'Classroom6x/class-516.html',
    thumbnail: 'thumbnail/class-516.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-517',
    title: 'Iron Snout',
    description: 'Iron Snout - Classroom6x unblocked game',
    url: 'Classroom6x/class-517.html',
    thumbnail: 'thumbnail/class-517.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-518',
    title: 'Burrito Bison',
    description: 'Burrito Bison - Classroom6x unblocked game',
    url: 'Classroom6x/class-518.html',
    thumbnail: 'thumbnail/class-518.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-519',
    title: 'Penalty Kick Online',
    description: 'Penalty Kick Online - Classroom6x unblocked game',
    url: 'Classroom6x/class-519.html',
    thumbnail: 'thumbnail/class-519.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-520',
    title: 'Short Life',
    description: 'Short Life - Classroom6x unblocked game',
    url: 'Classroom6x/class-520.html',
    thumbnail: 'thumbnail/class-520.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-521',
    title: 'Color Switch',
    description: 'Color Switch - Classroom6x unblocked game',
    url: 'Classroom6x/class-521.html',
    thumbnail: 'thumbnail/class-521.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-522',
    title: 'Highway Traffic',
    description: 'Highway Traffic - Classroom6x unblocked game',
    url: 'Classroom6x/class-522.html',
    thumbnail: 'thumbnail/class-522.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-523',
    title: 'Earn To Die',
    description: 'Earn To Die - Classroom6x unblocked game',
    url: 'Classroom6x/class-523.html',
    thumbnail: 'thumbnail/class-523.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-524',
    title: 'Doodle Champion Island',
    description: 'Doodle Champion Island - Classroom6x unblocked game',
    url: 'Classroom6x/class-524.html',
    thumbnail: 'thumbnail/class-524.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-525',
    title: 'Masked Forces',
    description: 'Masked Forces - Classroom6x unblocked game',
    url: 'Classroom6x/class-525.html',
    thumbnail: 'thumbnail/class-525.png',
    category: '3D'
  },
  {
    id: 'classroom6x-526',
    title: 'Cluster Rush',
    description: 'Cluster Rush - Classroom6x unblocked game',
    url: 'Classroom6x/class-526.html',
    thumbnail: 'thumbnail/class-526.png',
    category: '3D'
  },
  {
    id: 'classroom6x-527',
    title: 'Rocket Soccer Derby',
    description: 'Rocket Soccer Derby - Classroom6x unblocked game',
    url: 'Classroom6x/class-527.html',
    thumbnail: 'thumbnail/class-527.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-528',
    title: 'N Gon',
    description: 'N Gon - Classroom6x unblocked game',
    url: 'Classroom6x/class-528.html',
    thumbnail: 'thumbnail/class-528.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-529',
    title: 'Big Shot Boxing',
    description: 'Big Shot Boxing - Classroom6x unblocked game',
    url: 'Classroom6x/class-529.html',
    thumbnail: 'thumbnail/class-529.png',
    category: 'Fighting'
  },
  {
    id: 'classroom6x-530',
    title: 'Idle Miner',
    description: 'Idle Miner - Classroom6x unblocked game',
    url: 'Classroom6x/class-530.html',
    thumbnail: 'thumbnail/class-530.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-531',
    title: '10 Minutes Till Dawn',
    description: '10 Minutes Till Dawn - Classroom6x unblocked game',
    url: 'Classroom6x/class-531.html',
    thumbnail: 'thumbnail/class-531.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-532',
    title: 'Draw The Hill',
    description: 'Draw The Hill - Classroom6x unblocked game',
    url: 'Classroom6x/class-532.html',
    thumbnail: 'thumbnail/class-532.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-533',
    title: 'Gunspin',
    description: 'Gunspin - Classroom6x unblocked game',
    url: 'Classroom6x/class-533.html',
    thumbnail: 'thumbnail/class-533.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-534',
    title: 'Funny Shooter 2',
    description: 'Funny Shooter 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-534.html',
    thumbnail: 'thumbnail/class-534.png',
    category: '3D'
  },
  {
    id: 'classroom6x-535',
    title: 'Death Run 3d',
    description: 'Death Run 3d - Classroom6x unblocked game',
    url: 'Classroom6x/class-535.html',
    thumbnail: 'thumbnail/class-535.png',
    category: '3D'
  },
  {
    id: 'classroom6x-536',
    title: 'Stack Ball',
    description: 'Stack Ball - Classroom6x unblocked game',
    url: 'Classroom6x/class-536.html',
    thumbnail: 'thumbnail/class-536.png',
    category: '3D'
  },
  {
    id: 'classroom6x-537',
    title: 'Snow Rider 3D',
    description: 'Snow Rider 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-537.html',
    thumbnail: 'thumbnail/class-537.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-538',
    title: 'Orbital Survival',
    description: 'Orbital Survival - Classroom6x unblocked game',
    url: 'Classroom6x/class-538.html',
    thumbnail: 'thumbnail/class-538.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-539',
    title: 'Big Tall Small',
    description: 'Big Tall Small - Classroom6x unblocked game',
    url: 'Classroom6x/class-539.html',
    thumbnail: 'thumbnail/class-539.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-540',
    title: 'Slope City',
    description: 'Slope City - Classroom6x unblocked game',
    url: 'Classroom6x/class-540.html',
    thumbnail: 'thumbnail/class-540.png',
    category: '3D'
  },
  {
    id: 'classroom6x-541',
    title: 'Slope Tunnel',
    description: 'Slope Tunnel - Classroom6x unblocked game',
    url: 'Classroom6x/class-541.html',
    thumbnail: 'thumbnail/class-541.png',
    category: '3D'
  },
  {
    id: 'classroom6x-542',
    title: 'Leader Strike',
    description: 'Leader Strike - Classroom6x unblocked game',
    url: 'Classroom6x/class-542.html',
    thumbnail: 'thumbnail/class-542.png',
    category: 'Multiplayer'
  },
  {
    id: 'classroom6x-543',
    title: 'Top Speed Racing 3d',
    description: 'Top Speed Racing 3d - Classroom6x unblocked game',
    url: 'Classroom6x/class-543.html',
    thumbnail: 'thumbnail/class-543.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-544',
    title: 'Death Chase',
    description: 'Death Chase - Classroom6x unblocked game',
    url: 'Classroom6x/class-544.html',
    thumbnail: 'thumbnail/class-544.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-546',
    title: 'Adventure Drivers',
    description: 'Adventure Drivers - Classroom6x unblocked game',
    url: 'Classroom6x/class-546.html',
    thumbnail: 'thumbnail/class-546.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-547',
    title: 'Turbo Moto Racer',
    description: 'Turbo Moto Racer - Classroom6x unblocked game',
    url: 'Classroom6x/class-547.html',
    thumbnail: 'thumbnail/class-547.png',
    category: '3D'
  },
  {
    id: 'classroom6x-548',
    title: 'Poor Bunny',
    description: 'Poor Bunny - Classroom6x unblocked game',
    url: 'Classroom6x/class-548.html',
    thumbnail: 'thumbnail/class-548.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-549',
    title: 'Highway Rider Extreme',
    description: 'Highway Rider Extreme - Classroom6x unblocked game',
    url: 'Classroom6x/class-549.html',
    thumbnail: 'thumbnail/class-549.png',
    category: '3D'
  },
  {
    id: 'classroom6x-550',
    title: 'Traffic Mania',
    description: 'Traffic Mania - Classroom6x unblocked game',
    url: 'Classroom6x/class-550.html',
    thumbnail: 'thumbnail/class-550.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-551',
    title: 'Merge Round Racers',
    description: 'Merge Round Racers - Classroom6x unblocked game',
    url: 'Classroom6x/class-551.html',
    thumbnail: 'thumbnail/class-551.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-552',
    title: 'Pixel Gun Survival',
    description: 'Pixel Gun Survival - Classroom6x unblocked game',
    url: 'Classroom6x/class-552.html',
    thumbnail: 'thumbnail/class-552.png',
    category: 'Multiplayer'
  },
  {
    id: 'classroom6x-553',
    title: 'Cubito Mayhem',
    description: 'Cubito Mayhem - Classroom6x unblocked game',
    url: 'Classroom6x/class-553.html',
    thumbnail: 'thumbnail/class-553.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-554',
    title: 'Archery World Tour',
    description: 'Archery World Tour - Classroom6x unblocked game',
    url: 'Classroom6x/class-554.html',
    thumbnail: 'thumbnail/class-554.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-555',
    title: 'Evo City Driving',
    description: 'Evo City Driving - Classroom6x unblocked game',
    url: 'Classroom6x/class-555.html',
    thumbnail: 'thumbnail/class-555.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-556',
    title: 'Hover Racer',
    description: 'Hover Racer - Classroom6x unblocked game',
    url: 'Classroom6x/class-556.html',
    thumbnail: 'thumbnail/class-556.png',
    category: 'Racing'
  },
  {
    id: 'classroom6x-557',
    title: 'Pre Civilization Bronze Age',
    description: 'Pre Civilization Bronze Age - Classroom6x unblocked game',
    url: 'Classroom6x/class-557.html',
    thumbnail: 'thumbnail/class-557.png',
    category: 'Strategy'
  },
  {
    id: 'classroom6x-558',
    title: 'Coffee Shop',
    description: 'Coffee Shop - Classroom6x unblocked game',
    url: 'Classroom6x/class-558.html',
    thumbnail: 'thumbnail/class-558.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-559',
    title: 'Riddle School',
    description: 'Riddle School - Classroom6x unblocked game',
    url: 'Classroom6x/class-559.html',
    thumbnail: 'thumbnail/class-559.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-560',
    title: 'Duck Life 2',
    description: 'Duck Life 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-560.html',
    thumbnail: 'thumbnail/class-560.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-561',
    title: 'Duck Life 3 Evolution',
    description: 'Duck Life 3 Evolution - Classroom6x unblocked game',
    url: 'Classroom6x/class-561.html',
    thumbnail: 'thumbnail/class-561.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-562',
    title: 'Worlds Hardest Game 3',
    description: 'Worlds Hardest Game 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-562.html',
    thumbnail: 'thumbnail/class-562.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-563',
    title: 'Candy Jump',
    description: 'Candy Jump - Classroom6x unblocked game',
    url: 'Classroom6x/class-563.html',
    thumbnail: 'thumbnail/class-563.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-564',
    title: 'Factory Balls Forever',
    description: 'Factory Balls Forever - Classroom6x unblocked game',
    url: 'Classroom6x/class-564.html',
    thumbnail: 'thumbnail/class-564.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-565',
    title: 'Madalin Stunt Cars 2',
    description: 'Madalin Stunt Cars 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-565.html',
    thumbnail: 'thumbnail/class-565.png',
    category: '3D'
  },
  {
    id: 'classroom6x-566',
    title: 'Madalin Stunt Cars 3',
    description: 'Madalin Stunt Cars 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-566.html',
    thumbnail: 'thumbnail/class-566.png',
    category: '3D'
  },
  {
    id: 'classroom6x-567',
    title: 'Vex 4',
    description: 'Vex 4 - Classroom6x unblocked game',
    url: 'Classroom6x/class-567.html',
    thumbnail: 'thumbnail/class-567.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-568',
    title: 'Bob The Robber 4',
    description: 'Bob The Robber 4 - Classroom6x unblocked game',
    url: 'Classroom6x/class-568.html',
    thumbnail: 'thumbnail/class-568.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-569',
    title: 'B-Cubed',
    description: 'B-Cubed - Classroom6x unblocked game',
    url: 'Classroom6x/class-569.html',
    thumbnail: 'thumbnail/class-569.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-570',
    title: 'Gun Mayhem',
    description: 'Gun Mayhem - Classroom6x unblocked game',
    url: 'Classroom6x/class-570.html',
    thumbnail: 'thumbnail/class-570.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-571',
    title: 'Awesome Tanks',
    description: 'Awesome Tanks - Classroom6x unblocked game',
    url: 'Classroom6x/class-571.html',
    thumbnail: 'thumbnail/class-571.png',
    category: 'Fighting'
  },
  {
    id: 'classroom6x-572',
    title: 'Color Tunnel 2',
    description: 'Color Tunnel 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-572.html',
    thumbnail: 'thumbnail/class-572.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-573',
    title: 'Parking Fury 2',
    description: 'Parking Fury 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-573.html',
    thumbnail: 'thumbnail/class-573.png',
    category: '3D'
  },
  {
    id: 'classroom6x-574',
    title: 'Block The Pig',
    description: 'Block The Pig - Classroom6x unblocked game',
    url: 'Classroom6x/class-574.html',
    thumbnail: 'thumbnail/class-574.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-575',
    title: 'Stickman Ragdoll Crash Fun',
    description: 'Stickman Ragdoll Crash Fun - Classroom6x unblocked game',
    url: 'Classroom6x/class-575.html',
    thumbnail: 'thumbnail/class-575.png',
    category: 'Stickman'
  },
  {
    id: 'classroom6x-576',
    title: 'Parkour Block 3d',
    description: 'Parkour Block 3d - Classroom6x unblocked game',
    url: 'Classroom6x/class-576.html',
    thumbnail: 'thumbnail/class-576.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-577',
    title: 'Bunny Hop',
    description: 'Bunny Hop - Classroom6x unblocked game',
    url: 'Classroom6x/class-577.html',
    thumbnail: 'thumbnail/class-577.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-578',
    title: 'Sketchbook 04',
    description: 'Sketchbook 04 - Classroom6x unblocked game',
    url: 'Classroom6x/class-578.html',
    thumbnail: 'thumbnail/class-578.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-579',
    title: 'Short Ride',
    description: 'Short Ride - Classroom6x unblocked game',
    url: 'Classroom6x/class-579.html',
    thumbnail: 'thumbnail/class-579.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-580',
    title: 'Murder',
    description: 'Murder - Classroom6x unblocked game',
    url: 'Classroom6x/class-580.html',
    thumbnail: 'thumbnail/class-580.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-581',
    title: 'Idle Digging Tycoon',
    description: 'Idle Digging Tycoon - Classroom6x unblocked game',
    url: 'Classroom6x/class-581.html',
    thumbnail: 'thumbnail/class-581.png',
    category: '3D'
  },
  {
    id: 'classroom6x-582',
    title: 'City Car Driving: Stunt Master',
    description: 'City Car Driving: Stunt Master - Classroom6x unblocked game',
    url: 'Classroom6x/class-582.html',
    thumbnail: 'thumbnail/class-582.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-583',
    title: 'Top Speed 3d',
    description: 'Top Speed 3d - Classroom6x unblocked game',
    url: 'Classroom6x/class-583.html',
    thumbnail: 'thumbnail/class-583.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-584',
    title: 'Gold Digger Frvr',
    description: 'Gold Digger Frvr - Classroom6x unblocked game',
    url: 'Classroom6x/class-584.html',
    thumbnail: 'thumbnail/class-584.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-585',
    title: 'Brain Test 2: Tricky Stories',
    description: 'Brain Test 2: Tricky Stories - Classroom6x unblocked game',
    url: 'Classroom6x/class-585.html',
    thumbnail: 'thumbnail/class-585.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-586',
    title: 'Idle Lumber Inc',
    description: 'Idle Lumber Inc - Classroom6x unblocked game',
    url: 'Classroom6x/class-586.html',
    thumbnail: 'thumbnail/class-586.png',
    category: '3D'
  },
  {
    id: 'classroom6x-587',
    title: 'Tiger Simulator 3d',
    description: 'Tiger Simulator 3d - Classroom6x unblocked game',
    url: 'Classroom6x/class-587.html',
    thumbnail: 'thumbnail/class-587.png',
    category: '3D'
  },
  {
    id: 'classroom6x-588',
    title: 'Soccer Skills Champions League',
    description: 'Soccer Skills Champions League - Classroom6x unblocked game',
    url: 'Classroom6x/class-588.html',
    thumbnail: 'thumbnail/class-588.png',
    category: '3D'
  },
  {
    id: 'classroom6x-589',
    title: 'Eugenes Life',
    description: 'Eugenes Life - Classroom6x unblocked game',
    url: 'Classroom6x/class-589.html',
    thumbnail: 'thumbnail/class-589.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-590',
    title: 'Stickman Bike',
    description: 'Stickman Bike - Classroom6x unblocked game',
    url: 'Classroom6x/class-590.html',
    thumbnail: 'thumbnail/class-590.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-591',
    title: 'Who Is',
    description: 'Who Is - Classroom6x unblocked game',
    url: 'Classroom6x/class-591.html',
    thumbnail: 'thumbnail/class-591.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-592',
    title: 'Pop It Master',
    description: 'Pop It Master - Classroom6x unblocked game',
    url: 'Classroom6x/class-592.html',
    thumbnail: 'thumbnail/class-592.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-593',
    title: 'Stunt Car Challenge 3',
    description: 'Stunt Car Challenge 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-593.html',
    thumbnail: 'thumbnail/class-593.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-594',
    title: 'Cyber Cars Punk Racing',
    description: 'Cyber Cars Punk Racing - Classroom6x unblocked game',
    url: 'Classroom6x/class-594.html',
    thumbnail: 'thumbnail/class-594.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-595',
    title: 'Merge Cyber Racers',
    description: 'Merge Cyber Racers - Classroom6x unblocked game',
    url: 'Classroom6x/class-595.html',
    thumbnail: 'thumbnail/class-595.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-597',
    title: 'Basket And Ball',
    description: 'Basket And Ball - Classroom6x unblocked game',
    url: 'Classroom6x/class-597.html',
    thumbnail: 'thumbnail/class-597.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-598',
    title: '3d Moto Simulator 2',
    description: '3d Moto Simulator 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-598.html',
    thumbnail: 'thumbnail/class-598.png',
    category: '3D'
  },
  {
    id: 'classroom6x-599',
    title: 'Bike Trials Winter 2',
    description: 'Bike Trials Winter 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-599.html',
    thumbnail: 'thumbnail/class-599.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-600',
    title: 'Merge Cakes',
    description: 'Merge Cakes - Classroom6x unblocked game',
    url: 'Classroom6x/class-600.html',
    thumbnail: 'thumbnail/class-600.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-601',
    title: 'Car Drift Racers 2',
    description: 'Car Drift Racers 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-601.html',
    thumbnail: 'thumbnail/class-601.png',
    category: 'Racing'
  },
  {
    id: 'classroom6x-602',
    title: 'Running Fred',
    description: 'Running Fred - Classroom6x unblocked game',
    url: 'Classroom6x/class-602.html',
    thumbnail: 'thumbnail/class-602.png',
    category: '3D'
  },
  {
    id: 'classroom6x-604',
    title: 'Go Kart Go Ultra',
    description: 'Go Kart Go Ultra - Classroom6x unblocked game',
    url: 'Classroom6x/class-604.html',
    thumbnail: 'thumbnail/class-604.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-605',
    title: 'Demolition Derby Crash Racing',
    description: 'Demolition Derby Crash Racing - Classroom6x unblocked game',
    url: 'Classroom6x/class-605.html',
    thumbnail: 'thumbnail/class-605.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-606',
    title: '3d Car Simulator',
    description: '3d Car Simulator - Classroom6x unblocked game',
    url: 'Classroom6x/class-606.html',
    thumbnail: 'thumbnail/class-606.png',
    category: '3D'
  },
  {
    id: 'classroom6x-607',
    title: 'Fortride: Open World',
    description: 'Fortride: Open World - Classroom6x unblocked game',
    url: 'Classroom6x/class-607.html',
    thumbnail: 'thumbnail/class-607.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-608',
    title: 'Impossible Monster Truck Race',
    description: 'Impossible Monster Truck Race - Classroom6x unblocked game',
    url: 'Classroom6x/class-608.html',
    thumbnail: 'thumbnail/class-608.png',
    category: 'Racing'
  },
  {
    id: 'classroom6x-610',
    title: 'Super Hexbee Merger',
    description: 'Super Hexbee Merger - Classroom6x unblocked game',
    url: 'Classroom6x/class-610.html',
    thumbnail: 'thumbnail/class-610.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-611',
    title: 'Marble Dash',
    description: 'Marble Dash - Classroom6x unblocked game',
    url: 'Classroom6x/class-611.html',
    thumbnail: 'thumbnail/class-611.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-612',
    title: 'Wizard Mike',
    description: 'Wizard Mike - Classroom6x unblocked game',
    url: 'Classroom6x/class-612.html',
    thumbnail: 'thumbnail/class-612.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-613',
    title: 'Survivor In Rainbow Monster',
    description: 'Survivor In Rainbow Monster - Classroom6x unblocked game',
    url: 'Classroom6x/class-613.html',
    thumbnail: 'thumbnail/class-613.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-614',
    title: 'Crazy Tunnel 3d',
    description: 'Crazy Tunnel 3d - Classroom6x unblocked game',
    url: 'Classroom6x/class-614.html',
    thumbnail: 'thumbnail/class-614.png',
    category: '3D'
  },
  {
    id: 'classroom6x-615',
    title: 'Grindcraft',
    description: 'Grindcraft - Classroom6x unblocked game',
    url: 'Classroom6x/class-615.html',
    thumbnail: 'thumbnail/class-615.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-616',
    title: 'Head Soccer 2023',
    description: 'Head Soccer 2023 - Classroom6x unblocked game',
    url: 'Classroom6x/class-616.html',
    thumbnail: 'thumbnail/class-616.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-617',
    title: 'Rolling Sky',
    description: 'Rolling Sky - Classroom6x unblocked game',
    url: 'Classroom6x/class-617.html',
    thumbnail: 'thumbnail/class-617.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-618',
    title: 'Bomb It 7',
    description: 'Bomb It 7 - Classroom6x unblocked game',
    url: 'Classroom6x/class-618.html',
    thumbnail: 'thumbnail/class-618.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-619',
    title: 'Stair Race 3d',
    description: 'Stair Race 3d - Classroom6x unblocked game',
    url: 'Classroom6x/class-619.html',
    thumbnail: 'thumbnail/class-619.png',
    category: '3D'
  },
  {
    id: 'classroom6x-620',
    title: 'Ape Sling',
    description: 'Ape Sling - Classroom6x unblocked game',
    url: 'Classroom6x/class-620.html',
    thumbnail: 'thumbnail/class-620.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-621',
    title: 'Icy Purple Head 3',
    description: 'Icy Purple Head 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-621.html',
    thumbnail: 'thumbnail/class-621.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-622',
    title: 'Idle Mining Empire',
    description: 'Idle Mining Empire - Classroom6x unblocked game',
    url: 'Classroom6x/class-622.html',
    thumbnail: 'thumbnail/class-622.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-623',
    title: 'Two Ball 3d Dark',
    description: 'Two Ball 3d Dark - Classroom6x unblocked game',
    url: 'Classroom6x/class-623.html',
    thumbnail: 'thumbnail/class-623.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-624',
    title: 'Stickman Fighter Mega Brawl',
    description: 'Stickman Fighter Mega Brawl - Classroom6x unblocked game',
    url: 'Classroom6x/class-624.html',
    thumbnail: 'thumbnail/class-624.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-625',
    title: 'Highway Racer 3d',
    description: 'Highway Racer 3d - Classroom6x unblocked game',
    url: 'Classroom6x/class-625.html',
    thumbnail: 'thumbnail/class-625.png',
    category: '3D'
  },
  {
    id: 'classroom6x-626',
    title: 'Real Cars In City',
    description: 'Real Cars In City - Classroom6x unblocked game',
    url: 'Classroom6x/class-626.html',
    thumbnail: 'thumbnail/class-626.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-627',
    title: 'Penalty Shooters 2',
    description: 'Penalty Shooters 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-627.html',
    thumbnail: 'thumbnail/class-627.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-628',
    title: 'Super Liquid Soccer',
    description: 'Super Liquid Soccer - Classroom6x unblocked game',
    url: 'Classroom6x/class-628.html',
    thumbnail: 'thumbnail/class-628.png',
    category: '3D'
  },
  {
    id: 'classroom6x-629',
    title: 'Stick Fighter',
    description: 'Stick Fighter - Classroom6x unblocked game',
    url: 'Classroom6x/class-629.html',
    thumbnail: 'thumbnail/class-629.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-630',
    title: 'Super Star Car',
    description: 'Super Star Car - Classroom6x unblocked game',
    url: 'Classroom6x/class-630.html',
    thumbnail: 'thumbnail/class-630.png',
    category: '3D'
  },
  {
    id: 'classroom6x-631',
    title: 'Idle Ants',
    description: 'Idle Ants - Classroom6x unblocked game',
    url: 'Classroom6x/class-631.html',
    thumbnail: 'thumbnail/class-631.png',
    category: '3D'
  },
  {
    id: 'classroom6x-632',
    title: 'Burnin\' Rubber Crash n\' Burn',
    description: 'Burnin\' Rubber Crash n\' Burn - Classroom6x unblocked game',
    url: 'Classroom6x/class-632.html',
    thumbnail: 'thumbnail/class-632.png',
    category: '3D'
  },
  {
    id: 'classroom6x-633',
    title: 'Tag',
    description: 'Tag - Classroom6x unblocked game',
    url: 'Classroom6x/class-633.html',
    thumbnail: 'thumbnail/class-633.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-634',
    title: 'Maze Path Of Light',
    description: 'Maze Path Of Light - Classroom6x unblocked game',
    url: 'Classroom6x/class-634.html',
    thumbnail: 'thumbnail/class-634.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-635',
    title: 'Water Color Sort',
    description: 'Water Color Sort - Classroom6x unblocked game',
    url: 'Classroom6x/class-635.html',
    thumbnail: 'thumbnail/class-635.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-636',
    title: 'Swingo',
    description: 'Swingo - Classroom6x unblocked game',
    url: 'Classroom6x/class-636.html',
    thumbnail: 'thumbnail/class-636.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-637',
    title: 'Eliza Mall Mania',
    description: 'Eliza Mall Mania - Classroom6x unblocked game',
    url: 'Classroom6x/class-637.html',
    thumbnail: 'thumbnail/class-637.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-638',
    title: 'Jumping Shell',
    description: 'Jumping Shell - Classroom6x unblocked game',
    url: 'Classroom6x/class-638.html',
    thumbnail: 'thumbnail/class-638.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-639',
    title: 'Fairy Dressup',
    description: 'Fairy Dressup - Classroom6x unblocked game',
    url: 'Classroom6x/class-639.html',
    thumbnail: 'thumbnail/class-639.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-640',
    title: 'Roly Poly Monsters',
    description: 'Roly Poly Monsters - Classroom6x unblocked game',
    url: 'Classroom6x/class-640.html',
    thumbnail: 'thumbnail/class-640.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-641',
    title: 'Chicken Merge',
    description: 'Chicken Merge - Classroom6x unblocked game',
    url: 'Classroom6x/class-641.html',
    thumbnail: 'thumbnail/class-641.png',
    category: 'Strategy'
  },
  {
    id: 'classroom6x-643',
    title: 'Cats',
    description: 'Cats - Classroom6x unblocked game',
    url: 'Classroom6x/class-643.html',
    thumbnail: 'thumbnail/class-643.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-644',
    title: 'Thumb Fighter',
    description: 'Thumb Fighter - Classroom6x unblocked game',
    url: 'Classroom6x/class-644.html',
    thumbnail: 'thumbnail/class-644.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-645',
    title: 'Drunken Duel',
    description: 'Drunken Duel - Classroom6x unblocked game',
    url: 'Classroom6x/class-645.html',
    thumbnail: 'thumbnail/class-645.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-647',
    title: 'Battle Wheels',
    description: 'Battle Wheels - Classroom6x unblocked game',
    url: 'Classroom6x/class-647.html',
    thumbnail: 'thumbnail/class-647.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-648',
    title: 'Tictactoe',
    description: 'Tictactoe - Classroom6x unblocked game',
    url: 'Classroom6x/class-648.html',
    thumbnail: 'thumbnail/class-648.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-649',
    title: 'Minibattles',
    description: 'Minibattles - Classroom6x unblocked game',
    url: 'Classroom6x/class-649.html',
    thumbnail: 'thumbnail/class-649.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-650',
    title: 'Fortz',
    description: 'Fortz - Classroom6x unblocked game',
    url: 'Classroom6x/class-650.html',
    thumbnail: 'thumbnail/class-650.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-651',
    title: 'Wrassling',
    description: 'Wrassling - Classroom6x unblocked game',
    url: 'Classroom6x/class-651.html',
    thumbnail: 'thumbnail/class-651.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-653',
    title: 'Super Tunnel Rush',
    description: 'Super Tunnel Rush - Classroom6x unblocked game',
    url: 'Classroom6x/class-653.html',
    thumbnail: 'thumbnail/class-653.png',
    category: '3D'
  },
  {
    id: 'classroom6x-654',
    title: 'Burnin\' Rubber 5 Xs',
    description: 'Burnin\' Rubber 5 Xs - Classroom6x unblocked game',
    url: 'Classroom6x/class-654.html',
    thumbnail: 'thumbnail/class-654.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-655',
    title: 'Cars Thief',
    description: 'Cars Thief - Classroom6x unblocked game',
    url: 'Classroom6x/class-655.html',
    thumbnail: 'thumbnail/class-655.png',
    category: '3D'
  },
  {
    id: 'classroom6x-657',
    title: 'Lemonade Stand',
    description: 'Lemonade Stand - Classroom6x unblocked game',
    url: 'Classroom6x/class-657.html',
    thumbnail: 'thumbnail/class-657.png',
    category: 'Strategy'
  },
  {
    id: 'classroom6x-658',
    title: 'Mob City',
    description: 'Mob City - Classroom6x unblocked game',
    url: 'Classroom6x/class-658.html',
    thumbnail: 'thumbnail/class-658.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-659',
    title: 'The Little Giant',
    description: 'The Little Giant - Classroom6x unblocked game',
    url: 'Classroom6x/class-659.html',
    thumbnail: 'thumbnail/class-659.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-660',
    title: 'Three Goblets',
    description: 'Three Goblets - Classroom6x unblocked game',
    url: 'Classroom6x/class-660.html',
    thumbnail: 'thumbnail/class-660.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-662',
    title: 'Skiing Fred',
    description: 'Skiing Fred - Classroom6x unblocked game',
    url: 'Classroom6x/class-662.html',
    thumbnail: 'thumbnail/class-662.png',
    category: '3D'
  },
  {
    id: 'classroom6x-663',
    title: 'Ludo Multiplayer',
    description: 'Ludo Multiplayer - Classroom6x unblocked game',
    url: 'Classroom6x/class-663.html',
    thumbnail: 'thumbnail/class-663.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-664',
    title: 'Squish Run',
    description: 'Squish Run - Classroom6x unblocked game',
    url: 'Classroom6x/class-664.html',
    thumbnail: 'thumbnail/class-664.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-665',
    title: 'Bumper Cars Soccer',
    description: 'Bumper Cars Soccer - Classroom6x unblocked game',
    url: 'Classroom6x/class-665.html',
    thumbnail: 'thumbnail/class-665.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-666',
    title: 'Rowdy Wrestling',
    description: 'Rowdy Wrestling - Classroom6x unblocked game',
    url: 'Classroom6x/class-666.html',
    thumbnail: 'thumbnail/class-666.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-667',
    title: 'Bubble Trouble',
    description: 'Bubble Trouble - Classroom6x unblocked game',
    url: 'Classroom6x/class-667.html',
    thumbnail: 'thumbnail/class-667.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-668',
    title: 'Dunkers',
    description: 'Dunkers - Classroom6x unblocked game',
    url: 'Classroom6x/class-668.html',
    thumbnail: 'thumbnail/class-668.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-669',
    title: 'Boxing Physics 2',
    description: 'Boxing Physics 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-669.html',
    thumbnail: 'thumbnail/class-669.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-671',
    title: 'Superbattle 2',
    description: 'Superbattle 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-671.html',
    thumbnail: 'thumbnail/class-671.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-672',
    title: 'Bubble Trouble 3',
    description: 'Bubble Trouble 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-672.html',
    thumbnail: 'thumbnail/class-672.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-673',
    title: 'Tube Jumpers',
    description: 'Tube Jumpers - Classroom6x unblocked game',
    url: 'Classroom6x/class-673.html',
    thumbnail: 'thumbnail/class-673.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-674',
    title: 'Tank Trouble 2',
    description: 'Tank Trouble 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-674.html',
    thumbnail: 'thumbnail/class-674.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-675',
    title: 'Dunkbrush',
    description: 'Dunkbrush - Classroom6x unblocked game',
    url: 'Classroom6x/class-675.html',
    thumbnail: 'thumbnail/class-675.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-676',
    title: 'Linebacker Alley 2',
    description: 'Linebacker Alley 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-676.html',
    thumbnail: 'thumbnail/class-676.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-677',
    title: 'Cricket World Cup',
    description: 'Cricket World Cup - Classroom6x unblocked game',
    url: 'Classroom6x/class-677.html',
    thumbnail: 'thumbnail/class-677.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-678',
    title: 'Pool Club',
    description: 'Pool Club - Classroom6x unblocked game',
    url: 'Classroom6x/class-678.html',
    thumbnail: 'thumbnail/class-678.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-680',
    title: 'A Small World Cup',
    description: 'A Small World Cup - Classroom6x unblocked game',
    url: 'Classroom6x/class-680.html',
    thumbnail: 'thumbnail/class-680.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-681',
    title: 'Free Kick Shooter',
    description: 'Free Kick Shooter - Classroom6x unblocked game',
    url: 'Classroom6x/class-681.html',
    thumbnail: 'thumbnail/class-681.png',
    category: '3D'
  },
  {
    id: 'classroom6x-682',
    title: 'Air Hockey Championship Deluxe',
    description: 'Air Hockey Championship Deluxe - Classroom6x unblocked game',
    url: 'Classroom6x/class-682.html',
    thumbnail: 'thumbnail/class-682.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-683',
    title: 'Kix Dream Soccer',
    description: 'Kix Dream Soccer - Classroom6x unblocked game',
    url: 'Classroom6x/class-683.html',
    thumbnail: 'thumbnail/class-683.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-684',
    title: 'Unicycle Hero',
    description: 'Unicycle Hero - Classroom6x unblocked game',
    url: 'Classroom6x/class-684.html',
    thumbnail: 'thumbnail/class-684.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-685',
    title: '4th And Goal 2022',
    description: '4th And Goal 2022 - Classroom6x unblocked game',
    url: 'Classroom6x/class-685.html',
    thumbnail: 'thumbnail/class-685.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-686',
    title: 'Stock Car Hero',
    description: 'Stock Car Hero - Classroom6x unblocked game',
    url: 'Classroom6x/class-686.html',
    thumbnail: 'thumbnail/class-686.png',
    category: '3D'
  },
  {
    id: 'classroom6x-687',
    title: 'Athletics Hero',
    description: 'Athletics Hero - Classroom6x unblocked game',
    url: 'Classroom6x/class-687.html',
    thumbnail: 'thumbnail/class-687.png',
    category: '3D'
  },
  {
    id: 'classroom6x-688',
    title: 'Super Bike The Champion',
    description: 'Super Bike The Champion - Classroom6x unblocked game',
    url: 'Classroom6x/class-688.html',
    thumbnail: 'thumbnail/class-688.png',
    category: '3D'
  },
  {
    id: 'classroom6x-689',
    title: 'Bowling Stars',
    description: 'Bowling Stars - Classroom6x unblocked game',
    url: 'Classroom6x/class-689.html',
    thumbnail: 'thumbnail/class-689.png',
    category: '3D'
  },
  {
    id: 'classroom6x-690',
    title: 'Aqua Thrills',
    description: 'Aqua Thrills - Classroom6x unblocked game',
    url: 'Classroom6x/class-690.html',
    thumbnail: 'thumbnail/class-690.png',
    category: '3D'
  },
  {
    id: 'classroom6x-691',
    title: 'Basket Champs',
    description: 'Basket Champs - Classroom6x unblocked game',
    url: 'Classroom6x/class-691.html',
    thumbnail: 'thumbnail/class-691.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-692',
    title: 'Grand Prix Hero',
    description: 'Grand Prix Hero - Classroom6x unblocked game',
    url: 'Classroom6x/class-692.html',
    thumbnail: 'thumbnail/class-692.png',
    category: '3D'
  },
  {
    id: 'classroom6x-693',
    title: 'Stickman School Run',
    description: 'Stickman School Run - Classroom6x unblocked game',
    url: 'Classroom6x/class-693.html',
    thumbnail: 'thumbnail/class-693.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-694',
    title: 'Stickman Bike Pr',
    description: 'Stickman Bike Pr - Classroom6x unblocked game',
    url: 'Classroom6x/class-694.html',
    thumbnail: 'thumbnail/class-694.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-695',
    title: 'Heads Arena Soccer All Stars',
    description: 'Heads Arena Soccer All Stars - Classroom6x unblocked game',
    url: 'Classroom6x/class-695.html',
    thumbnail: 'thumbnail/class-695.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-696',
    title: 'Power Badminton',
    description: 'Power Badminton - Classroom6x unblocked game',
    url: 'Classroom6x/class-696.html',
    thumbnail: 'thumbnail/class-696.png',
    category: 'Multiplayer'
  },
  {
    id: 'classroom6x-697',
    title: 'Foot Chinko',
    description: 'Foot Chinko - Classroom6x unblocked game',
    url: 'Classroom6x/class-697.html',
    thumbnail: 'thumbnail/class-697.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-698',
    title: 'Rowdy City Wrestling',
    description: 'Rowdy City Wrestling - Classroom6x unblocked game',
    url: 'Classroom6x/class-698.html',
    thumbnail: 'thumbnail/class-698.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-699',
    title: 'My Pony My Little Race',
    description: 'My Pony My Little Race - Classroom6x unblocked game',
    url: 'Classroom6x/class-699.html',
    thumbnail: 'thumbnail/class-699.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-700',
    title: 'Jollyworld',
    description: 'Jollyworld - Classroom6x unblocked game',
    url: 'Classroom6x/class-700.html',
    thumbnail: 'thumbnail/class-700.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-701',
    title: 'Superbike Hero',
    description: 'Superbike Hero - Classroom6x unblocked game',
    url: 'Classroom6x/class-701.html',
    thumbnail: 'thumbnail/class-701.png',
    category: '3D'
  },
  {
    id: 'classroom6x-702',
    title: 'Street Ball Jam',
    description: 'Street Ball Jam - Classroom6x unblocked game',
    url: 'Classroom6x/class-702.html',
    thumbnail: 'thumbnail/class-702.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-703',
    title: 'Golf Champions',
    description: 'Golf Champions - Classroom6x unblocked game',
    url: 'Classroom6x/class-703.html',
    thumbnail: 'thumbnail/class-703.png',
    category: '3D'
  },
  {
    id: 'classroom6x-704',
    title: 'Slime Road',
    description: 'Slime Road - Classroom6x unblocked game',
    url: 'Classroom6x/class-704.html',
    thumbnail: 'thumbnail/class-704.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-705',
    title: 'Super Racing Gt Drag Pro',
    description: 'Super Racing Gt Drag Pro - Classroom6x unblocked game',
    url: 'Classroom6x/class-705.html',
    thumbnail: 'thumbnail/class-705.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-706',
    title: 'Car Simulator Arena',
    description: 'Car Simulator Arena - Classroom6x unblocked game',
    url: 'Classroom6x/class-706.html',
    thumbnail: 'thumbnail/class-706.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-707',
    title: 'Mad Day',
    description: 'Mad Day - Classroom6x unblocked game',
    url: 'Classroom6x/class-707.html',
    thumbnail: 'thumbnail/class-707.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-708',
    title: 'Monsters Wheels Special',
    description: 'Monsters Wheels Special - Classroom6x unblocked game',
    url: 'Classroom6x/class-708.html',
    thumbnail: 'thumbnail/class-708.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-709',
    title: 'Real Simulator Monster Truck',
    description: 'Real Simulator Monster Truck - Classroom6x unblocked game',
    url: 'Classroom6x/class-709.html',
    thumbnail: 'thumbnail/class-709.png',
    category: '3D'
  },
  {
    id: 'classroom6x-710',
    title: 'Burnout Drift Seaport Max',
    description: 'Burnout Drift Seaport Max - Classroom6x unblocked game',
    url: 'Classroom6x/class-710.html',
    thumbnail: 'thumbnail/class-710.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-711',
    title: 'Mad Truck Challenge Special',
    description: 'Mad Truck Challenge Special - Classroom6x unblocked game',
    url: 'Classroom6x/class-711.html',
    thumbnail: 'thumbnail/class-711.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-712',
    title: 'Just Park It 11',
    description: 'Just Park It 11 - Classroom6x unblocked game',
    url: 'Classroom6x/class-712.html',
    thumbnail: 'thumbnail/class-712.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-713',
    title: '18 Wheeler Cargo Simulator',
    description: '18 Wheeler Cargo Simulator - Classroom6x unblocked game',
    url: 'Classroom6x/class-713.html',
    thumbnail: 'thumbnail/class-713.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-714',
    title: 'Extreme Off Road Cars 3: Cargo',
    description: 'Extreme Off Road Cars 3: Cargo - Classroom6x unblocked game',
    url: 'Classroom6x/class-714.html',
    thumbnail: 'thumbnail/class-714.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-715',
    title: 'Extreme Off Road Cars',
    description: 'Extreme Off Road Cars - Classroom6x unblocked game',
    url: 'Classroom6x/class-715.html',
    thumbnail: 'thumbnail/class-715.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-716',
    title: 'School Bus Demolition Derby',
    description: 'School Bus Demolition Derby - Classroom6x unblocked game',
    url: 'Classroom6x/class-716.html',
    thumbnail: 'thumbnail/class-716.png',
    category: '3D'
  },
  {
    id: 'classroom6x-717',
    title: 'Noob Drive',
    description: 'Noob Drive - Classroom6x unblocked game',
    url: 'Classroom6x/class-717.html',
    thumbnail: 'thumbnail/class-717.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-718',
    title: 'Blocky Trials',
    description: 'Blocky Trials - Classroom6x unblocked game',
    url: 'Classroom6x/class-718.html',
    thumbnail: 'thumbnail/class-718.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-719',
    title: 'Bike Trials Winter 1',
    description: 'Bike Trials Winter 1 - Classroom6x unblocked game',
    url: 'Classroom6x/class-719.html',
    thumbnail: 'thumbnail/class-719.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-720',
    title: 'Tricks',
    description: 'Tricks - Classroom6x unblocked game',
    url: 'Classroom6x/class-720.html',
    thumbnail: 'thumbnail/class-720.png',
    category: '3D'
  },
  {
    id: 'classroom6x-721',
    title: 'Moto Maniac',
    description: 'Moto Maniac - Classroom6x unblocked game',
    url: 'Classroom6x/class-721.html',
    thumbnail: 'thumbnail/class-721.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-722',
    title: 'Moto Maniac 2',
    description: 'Moto Maniac 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-722.html',
    thumbnail: 'thumbnail/class-722.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-723',
    title: 'Bike Trials Offroad 1',
    description: 'Bike Trials Offroad 1 - Classroom6x unblocked game',
    url: 'Classroom6x/class-723.html',
    thumbnail: 'thumbnail/class-723.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-724',
    title: 'Parking Fury 3D Beach City',
    description: 'Parking Fury 3D Beach City - Classroom6x unblocked game',
    url: 'Classroom6x/class-724.html',
    thumbnail: 'thumbnail/class-724.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-725',
    title: 'Parking Fury 3D: Night Thief',
    description: 'Parking Fury 3D: Night Thief - Classroom6x unblocked game',
    url: 'Classroom6x/class-725.html',
    thumbnail: 'thumbnail/class-725.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-726',
    title: 'Cars Thief Tank Edition',
    description: 'Cars Thief Tank Edition - Classroom6x unblocked game',
    url: 'Classroom6x/class-726.html',
    thumbnail: 'thumbnail/class-726.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-727',
    title: 'Dubai Police Parking 2',
    description: 'Dubai Police Parking 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-727.html',
    thumbnail: 'thumbnail/class-727.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-728',
    title: 'Parking Fury 3D',
    description: 'Parking Fury 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-728.html',
    thumbnail: 'thumbnail/class-728.png',
    category: '3D'
  },
  {
    id: 'classroom6x-729',
    title: 'Swatforce vs Terrorists',
    description: 'Swatforce vs Terrorists - Classroom6x unblocked game',
    url: 'Classroom6x/class-729.html',
    thumbnail: 'thumbnail/class-729.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-730',
    title: 'Parking Fury 3D Bounty Hunter',
    description: 'Parking Fury 3D Bounty Hunter - Classroom6x unblocked game',
    url: 'Classroom6x/class-730.html',
    thumbnail: 'thumbnail/class-730.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-731',
    title: 'Detective Loupe Puzzle',
    description: 'Detective Loupe Puzzle - Classroom6x unblocked game',
    url: 'Classroom6x/class-731.html',
    thumbnail: 'thumbnail/class-731.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-732',
    title: '11-11',
    description: '11-11 - Classroom6x unblocked game',
    url: 'Classroom6x/class-732.html',
    thumbnail: 'thumbnail/class-732.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-733',
    title: 'Free The Key',
    description: 'Free The Key - Classroom6x unblocked game',
    url: 'Classroom6x/class-733.html',
    thumbnail: 'thumbnail/class-733.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-734',
    title: 'Word City Crossed',
    description: 'Word City Crossed - Classroom6x unblocked game',
    url: 'Classroom6x/class-734.html',
    thumbnail: 'thumbnail/class-734.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-735',
    title: 'Words Search Classic Edition',
    description: 'Words Search Classic Edition - Classroom6x unblocked game',
    url: 'Classroom6x/class-735.html',
    thumbnail: 'thumbnail/class-735.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-736',
    title: 'Pixwars 2',
    description: 'Pixwars 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-736.html',
    thumbnail: 'thumbnail/class-736.png',
    category: '3D'
  },
  {
    id: 'classroom6x-737',
    title: 'Toon Off',
    description: 'Toon Off - Classroom6x unblocked game',
    url: 'Classroom6x/class-737.html',
    thumbnail: 'thumbnail/class-737.png',
    category: 'Multiplayer'
  },
  {
    id: 'classroom6x-738',
    title: 'Stickman Army Team Battle',
    description: 'Stickman Army Team Battle - Classroom6x unblocked game',
    url: 'Classroom6x/class-738.html',
    thumbnail: 'thumbnail/class-738.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-739',
    title: 'Stickman Fighter Epic Battle 2',
    description: 'Stickman Fighter Epic Battle 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-739.html',
    thumbnail: 'thumbnail/class-739.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-740',
    title: 'Stickman Boxing KO Champion',
    description: 'Stickman Boxing KO Champion - Classroom6x unblocked game',
    url: 'Classroom6x/class-740.html',
    thumbnail: 'thumbnail/class-740.png',
    category: 'Fighting'
  },
  {
    id: 'classroom6x-741',
    title: 'Stickman Bridge Constructor',
    description: 'Stickman Bridge Constructor - Classroom6x unblocked game',
    url: 'Classroom6x/class-741.html',
    thumbnail: 'thumbnail/class-741.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-742',
    title: 'Fancy Pants 3',
    description: 'Fancy Pants 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-742.html',
    thumbnail: 'thumbnail/class-742.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-743',
    title: 'Fancy Pants 2',
    description: 'Fancy Pants 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-743.html',
    thumbnail: 'thumbnail/class-743.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-744',
    title: 'Stickman Army The Resistance',
    description: 'Stickman Army The Resistance - Classroom6x unblocked game',
    url: 'Classroom6x/class-744.html',
    thumbnail: 'thumbnail/class-744.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-745',
    title: 'Perfect Peel',
    description: 'Perfect Peel - Classroom6x unblocked game',
    url: 'Classroom6x/class-745.html',
    thumbnail: 'thumbnail/class-745.png',
    category: '3D'
  },
  {
    id: 'classroom6x-746',
    title: 'Dog Simulator 3D',
    description: 'Dog Simulator 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-746.html',
    thumbnail: 'thumbnail/class-746.png',
    category: '3D'
  },
  {
    id: 'classroom6x-747',
    title: 'Zombie Derby Pixel Survival',
    description: 'Zombie Derby Pixel Survival - Classroom6x unblocked game',
    url: 'Classroom6x/class-747.html',
    thumbnail: 'thumbnail/class-747.png',
    category: '3D'
  },
  {
    id: 'classroom6x-748',
    title: 'Hammer 2 Reloaded',
    description: 'Hammer 2 Reloaded - Classroom6x unblocked game',
    url: 'Classroom6x/class-748.html',
    thumbnail: 'thumbnail/class-748.png',
    category: '3D'
  },
  {
    id: 'classroom6x-749',
    title: 'Striker Dummies',
    description: 'Striker Dummies - Classroom6x unblocked game',
    url: 'Classroom6x/class-749.html',
    thumbnail: 'thumbnail/class-749.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-750',
    title: 'Puppet Master',
    description: 'Puppet Master - Classroom6x unblocked game',
    url: 'Classroom6x/class-750.html',
    thumbnail: 'thumbnail/class-750.png',
    category: '3D'
  },
  {
    id: 'classroom6x-751',
    title: 'Offroader V5',
    description: 'Offroader V5 - Classroom6x unblocked game',
    url: 'Classroom6x/class-751.html',
    thumbnail: 'thumbnail/class-751.png',
    category: '3D'
  },
  {
    id: 'classroom6x-752',
    title: 'Horse Simulator 3D',
    description: 'Horse Simulator 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-752.html',
    thumbnail: 'thumbnail/class-752.png',
    category: '3D'
  },
  {
    id: 'classroom6x-753',
    title: 'Panda Simulator 3D',
    description: 'Panda Simulator 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-753.html',
    thumbnail: 'thumbnail/class-753.png',
    category: '3D'
  },
  {
    id: 'classroom6x-754',
    title: 'Blocky Cars',
    description: 'Blocky Cars - Classroom6x unblocked game',
    url: 'Classroom6x/class-754.html',
    thumbnail: 'thumbnail/class-754.png',
    category: '3D'
  },
  {
    id: 'classroom6x-755',
    title: 'Horse Shoeing',
    description: 'Horse Shoeing - Classroom6x unblocked game',
    url: 'Classroom6x/class-755.html',
    thumbnail: 'thumbnail/class-755.png',
    category: '3D'
  },
  {
    id: 'classroom6x-756',
    title: 'Deer Simulator',
    description: 'Deer Simulator - Classroom6x unblocked game',
    url: 'Classroom6x/class-756.html',
    thumbnail: 'thumbnail/class-756.png',
    category: '3D'
  },
  {
    id: 'classroom6x-757',
    title: 'Wood Blocks 3D',
    description: 'Wood Blocks 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-757.html',
    thumbnail: 'thumbnail/class-757.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-758',
    title: 'Plactions',
    description: 'Plactions - Classroom6x unblocked game',
    url: 'Classroom6x/class-758.html',
    thumbnail: 'thumbnail/class-758.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-759',
    title: 'Basket Swooshes',
    description: 'Basket Swooshes - Classroom6x unblocked game',
    url: 'Classroom6x/class-759.html',
    thumbnail: 'thumbnail/class-759.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-761',
    title: 'Where Is My Cat',
    description: 'Where Is My Cat - Classroom6x unblocked game',
    url: 'Classroom6x/class-761.html',
    thumbnail: 'thumbnail/class-761.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-762',
    title: 'Word City Uncrossed',
    description: 'Word City Uncrossed - Classroom6x unblocked game',
    url: 'Classroom6x/class-762.html',
    thumbnail: 'thumbnail/class-762.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-763',
    title: 'Heart Star',
    description: 'Heart Star - Classroom6x unblocked game',
    url: 'Classroom6x/class-763.html',
    thumbnail: 'thumbnail/class-763.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-764',
    title: 'Panda Bubble Shooter',
    description: 'Panda Bubble Shooter - Classroom6x unblocked game',
    url: 'Classroom6x/class-764.html',
    thumbnail: 'thumbnail/class-764.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-765',
    title: 'Tiny Town Racing',
    description: 'Tiny Town Racing - Classroom6x unblocked game',
    url: 'Classroom6x/class-765.html',
    thumbnail: 'thumbnail/class-765.png',
    category: '3D'
  },
  {
    id: 'classroom6x-766',
    title: '12 Minibattles',
    description: '12 Minibattles - Classroom6x unblocked game',
    url: 'Classroom6x/class-766.html',
    thumbnail: 'thumbnail/class-766.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-767',
    title: 'Arithmetica',
    description: 'Arithmetica - Classroom6x unblocked game',
    url: 'Classroom6x/class-767.html',
    thumbnail: 'thumbnail/class-767.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-768',
    title: 'Cat Gunner: Super Zombie Shoot',
    description: 'Cat Gunner: Super Zombie Shoot - Classroom6x unblocked game',
    url: 'Classroom6x/class-768.html',
    thumbnail: 'thumbnail/class-768.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-769',
    title: 'City Rider',
    description: 'City Rider - Classroom6x unblocked game',
    url: 'Classroom6x/class-769.html',
    thumbnail: 'thumbnail/class-769.png',
    category: '3D'
  },
  {
    id: 'classroom6x-770',
    title: 'Soccar',
    description: 'Soccar - Classroom6x unblocked game',
    url: 'Classroom6x/class-770.html',
    thumbnail: 'thumbnail/class-770.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-771',
    title: 'Rio Rex',
    description: 'Rio Rex - Classroom6x unblocked game',
    url: 'Classroom6x/class-771.html',
    thumbnail: 'thumbnail/class-771.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-772',
    title: 'Recoil',
    description: 'Recoil - Classroom6x unblocked game',
    url: 'Classroom6x/class-772.html',
    thumbnail: 'thumbnail/class-772.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-773',
    title: 'Life The Game',
    description: 'Life The Game - Classroom6x unblocked game',
    url: 'Classroom6x/class-773.html',
    thumbnail: 'thumbnail/class-773.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-774',
    title: 'Kawaii Dressup',
    description: 'Kawaii Dressup - Classroom6x unblocked game',
    url: 'Classroom6x/class-774.html',
    thumbnail: 'thumbnail/class-774.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-776',
    title: 'Stupid Zombies',
    description: 'Stupid Zombies - Classroom6x unblocked game',
    url: 'Classroom6x/class-776.html',
    thumbnail: 'thumbnail/class-776.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-777',
    title: 'Golfinity',
    description: 'Golfinity - Classroom6x unblocked game',
    url: 'Classroom6x/class-777.html',
    thumbnail: 'thumbnail/class-777.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-778',
    title: 'Idle Startup Tycoon',
    description: 'Idle Startup Tycoon - Classroom6x unblocked game',
    url: 'Classroom6x/class-778.html',
    thumbnail: 'thumbnail/class-778.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-779',
    title: 'Infinity Loop',
    description: 'Infinity Loop - Classroom6x unblocked game',
    url: 'Classroom6x/class-779.html',
    thumbnail: 'thumbnail/class-779.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-780',
    title: 'Escaping The Prison',
    description: 'Escaping The Prison - Classroom6x unblocked game',
    url: 'Classroom6x/class-780.html',
    thumbnail: 'thumbnail/class-780.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-781',
    title: 'Fleeing The Complex',
    description: 'Fleeing The Complex - Classroom6x unblocked game',
    url: 'Classroom6x/class-781.html',
    thumbnail: 'thumbnail/class-781.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-782',
    title: 'Breaking The Bank',
    description: 'Breaking The Bank - Classroom6x unblocked game',
    url: 'Classroom6x/class-782.html',
    thumbnail: 'thumbnail/class-782.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-783',
    title: 'Stealing The Diamond',
    description: 'Stealing The Diamond - Classroom6x unblocked game',
    url: 'Classroom6x/class-783.html',
    thumbnail: 'thumbnail/class-783.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-784',
    title: 'Bloons Tower Defense 1',
    description: 'Bloons Tower Defense 1 - Classroom6x unblocked game',
    url: 'Classroom6x/class-784.html',
    thumbnail: 'thumbnail/class-784.png',
    category: 'Strategy'
  },
  {
    id: 'classroom6x-785',
    title: 'Car Climb Racing',
    description: 'Car Climb Racing - Classroom6x unblocked game',
    url: 'Classroom6x/class-785.html',
    thumbnail: 'thumbnail/class-785.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-787',
    title: 'City Bike Stunt 2',
    description: 'City Bike Stunt 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-787.html',
    thumbnail: 'thumbnail/class-787.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-788',
    title: 'Cubes King',
    description: 'Cubes King - Classroom6x unblocked game',
    url: 'Classroom6x/class-788.html',
    thumbnail: 'thumbnail/class-788.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-789',
    title: 'Hover Racer Drive',
    description: 'Hover Racer Drive - Classroom6x unblocked game',
    url: 'Classroom6x/class-789.html',
    thumbnail: 'thumbnail/class-789.png',
    category: '3D'
  },
  {
    id: 'classroom6x-790',
    title: '2048 Multitask',
    description: '2048 Multitask - Classroom6x unblocked game',
    url: 'Classroom6x/class-790.html',
    thumbnail: 'thumbnail/class-790.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-791',
    title: '4x4 Drive Offroad',
    description: '4x4 Drive Offroad - Classroom6x unblocked game',
    url: 'Classroom6x/class-791.html',
    thumbnail: 'thumbnail/class-791.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-792',
    title: 'Extreme Car Driving Simulator',
    description: 'Extreme Car Driving Simulator - Classroom6x unblocked game',
    url: 'Classroom6x/class-792.html',
    thumbnail: 'thumbnail/class-792.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-793',
    title: 'Furious Racing 3D',
    description: 'Furious Racing 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-793.html',
    thumbnail: 'thumbnail/class-793.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-794',
    title: 'Grindcraft Remastered',
    description: 'Grindcraft Remastered - Classroom6x unblocked game',
    url: 'Classroom6x/class-794.html',
    thumbnail: 'thumbnail/class-794.png',
    category: 'Idle'
  },
  {
    id: 'classroom6x-795',
    title: 'Gun Mayhem 3',
    description: 'Gun Mayhem 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-795.html',
    thumbnail: 'thumbnail/class-795.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-796',
    title: 'Jet Boy',
    description: 'Jet Boy - Classroom6x unblocked game',
    url: 'Classroom6x/class-796.html',
    thumbnail: 'thumbnail/class-796.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-797',
    title: 'Kart Race 3D',
    description: 'Kart Race 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-797.html',
    thumbnail: 'thumbnail/class-797.png',
    category: 'Racing'
  },
  {
    id: 'classroom6x-798',
    title: 'Maze Planet 3D',
    description: 'Maze Planet 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-798.html',
    thumbnail: 'thumbnail/class-798.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-799',
    title: 'Minecraft Builder',
    description: 'Minecraft Builder - Classroom6x unblocked game',
    url: 'Classroom6x/class-799.html',
    thumbnail: 'thumbnail/class-799.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-800',
    title: 'Slope 2 Multiplayer',
    description: 'Slope 2 Multiplayer - Classroom6x unblocked game',
    url: 'Classroom6x/class-800.html',
    thumbnail: 'thumbnail/class-800.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-801',
    title: 'Sniper Gun Shooting',
    description: 'Sniper Gun Shooting - Classroom6x unblocked game',
    url: 'Classroom6x/class-801.html',
    thumbnail: 'thumbnail/class-801.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-802',
    title: 'Speed Boat Extreme Racing',
    description: 'Speed Boat Extreme Racing - Classroom6x unblocked game',
    url: 'Classroom6x/class-802.html',
    thumbnail: 'thumbnail/class-802.png',
    category: 'Racing'
  },
  {
    id: 'classroom6x-803',
    title: 'Stack Bump 3D',
    description: 'Stack Bump 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-803.html',
    thumbnail: 'thumbnail/class-803.png',
    category: '3D'
  },
  {
    id: 'classroom6x-804',
    title: 'Subway Runner',
    description: 'Subway Runner - Classroom6x unblocked game',
    url: 'Classroom6x/class-804.html',
    thumbnail: 'thumbnail/class-804.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-806',
    title: 'Traffic Rider',
    description: 'Traffic Rider - Classroom6x unblocked game',
    url: 'Classroom6x/class-806.html',
    thumbnail: 'thumbnail/class-806.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-807',
    title: 'Two Neon Boxes',
    description: 'Two Neon Boxes - Classroom6x unblocked game',
    url: 'Classroom6x/class-807.html',
    thumbnail: 'thumbnail/class-807.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-808',
    title: 'Ultimate Car Driving',
    description: 'Ultimate Car Driving - Classroom6x unblocked game',
    url: 'Classroom6x/class-808.html',
    thumbnail: 'thumbnail/class-808.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-809',
    title: 'Vex 6',
    description: 'Vex 6 - Classroom6x unblocked game',
    url: 'Classroom6x/class-809.html',
    thumbnail: 'thumbnail/class-809.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-810',
    title: 'Volleyball Challenge',
    description: 'Volleyball Challenge - Classroom6x unblocked game',
    url: 'Classroom6x/class-810.html',
    thumbnail: 'thumbnail/class-810.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-811',
    title: 'Volley Random',
    description: 'Volley Random - Classroom6x unblocked game',
    url: 'Classroom6x/class-811.html',
    thumbnail: 'thumbnail/class-811.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-812',
    title: 'Paper Fighter 3D',
    description: 'Paper Fighter 3D - Classroom6x unblocked game',
    url: 'Classroom6x/class-812.html',
    thumbnail: 'thumbnail/class-812.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-813',
    title: 'Real City Driving 2',
    description: 'Real City Driving 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-813.html',
    thumbnail: 'thumbnail/class-813.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-814',
    title: 'Rocket Pult',
    description: 'Rocket Pult - Classroom6x unblocked game',
    url: 'Classroom6x/class-814.html',
    thumbnail: 'thumbnail/class-814.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-815',
    title: 'Shoot Stickman',
    description: 'Shoot Stickman - Classroom6x unblocked game',
    url: 'Classroom6x/class-815.html',
    thumbnail: 'thumbnail/class-815.png',
    category: 'Shooting'
  },
  {
    id: 'classroom6x-816',
    title: 'Shortcut Race',
    description: 'Shortcut Race - Classroom6x unblocked game',
    url: 'Classroom6x/class-816.html',
    thumbnail: 'thumbnail/class-816.png',
    category: 'Racing'
  },
  {
    id: 'classroom6x-817',
    title: 'Five Nights at Freddy\'s 2',
    description: 'Five Nights at Freddy\'s 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-817.html',
    thumbnail: 'thumbnail/class-817.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-818',
    title: 'Five Nights at Freddy\'s 3',
    description: 'Five Nights at Freddy\'s 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-818.html',
    thumbnail: 'thumbnail/class-818.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-819',
    title: 'Run 3 Editor',
    description: 'Run 3 Editor - Classroom6x unblocked game',
    url: 'Classroom6x/class-819.html',
    thumbnail: 'thumbnail/class-819.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-820',
    title: 'Tomb of The Mask Color',
    description: 'Tomb of The Mask Color - Classroom6x unblocked game',
    url: 'Classroom6x/class-820.html',
    thumbnail: 'thumbnail/class-820.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-821',
    title: 'Onion Boy',
    description: 'Onion Boy - Classroom6x unblocked game',
    url: 'Classroom6x/class-821.html',
    thumbnail: 'thumbnail/class-821.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-822',
    title: 'Rabbit Samurai',
    description: 'Rabbit Samurai - Classroom6x unblocked game',
    url: 'Classroom6x/class-822.html',
    thumbnail: 'thumbnail/class-822.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-823',
    title: 'Stickman Golf',
    description: 'Stickman Golf - Classroom6x unblocked game',
    url: 'Classroom6x/class-823.html',
    thumbnail: 'thumbnail/class-823.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-825',
    title: 'Boxing Random',
    description: 'Boxing Random - Classroom6x unblocked game',
    url: 'Classroom6x/class-825.html',
    thumbnail: 'thumbnail/class-825.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-826',
    title: 'Super Mario Bros',
    description: 'Super Mario Bros - Classroom6x unblocked game',
    url: 'Classroom6x/class-826.html',
    thumbnail: 'thumbnail/class-826.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-827',
    title: 'Paper Minecraft',
    description: 'Paper Minecraft - Classroom6x unblocked game',
    url: 'Classroom6x/class-827.html',
    thumbnail: 'thumbnail/class-827.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-828',
    title: 'Yohoho.io',
    description: 'Yohoho.io - Classroom6x unblocked game',
    url: 'Classroom6x/class-828.html',
    thumbnail: 'thumbnail/class-828.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-829',
    title: 'Monkey Mart',
    description: 'Monkey Mart - Classroom6x unblocked game',
    url: 'Classroom6x/class-829.html',
    thumbnail: 'thumbnail/class-829.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-830',
    title: 'Parkour Race',
    description: 'Parkour Race - Classroom6x unblocked game',
    url: 'Classroom6x/class-830.html',
    thumbnail: 'thumbnail/class-830.png',
    category: 'Running'
  },
  {
    id: 'classroom6x-831',
    title: 'Everywhere At The End Of Funk',
    description: 'Everywhere At The End Of Funk - Classroom6x unblocked game',
    url: 'Classroom6x/class-831.html',
    thumbnail: 'thumbnail/class-831.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-832',
    title: 'Flip Side',
    description: 'Flip Side - Classroom6x unblocked game',
    url: 'Classroom6x/class-832.html',
    thumbnail: 'thumbnail/class-832.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-833',
    title: 'FNF Vs Henry Stickmin',
    description: 'FNF Vs Henry Stickmin - Classroom6x unblocked game',
    url: 'Classroom6x/class-833.html',
    thumbnail: 'thumbnail/class-833.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-834',
    title: 'FNF Vs Hex Mod',
    description: 'FNF Vs Hex Mod - Classroom6x unblocked game',
    url: 'Classroom6x/class-834.html',
    thumbnail: 'thumbnail/class-834.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-835',
    title: 'FNF Vs Matt',
    description: 'FNF Vs Matt - Classroom6x unblocked game',
    url: 'Classroom6x/class-835.html',
    thumbnail: 'thumbnail/class-835.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-836',
    title: 'FNF Minus',
    description: 'FNF Minus - Classroom6x unblocked game',
    url: 'Classroom6x/class-836.html',
    thumbnail: 'thumbnail/class-836.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-837',
    title: 'FNF Michael Jackson\'s Rose Criminal',
    description: 'FNF Michael Jackson\'s Rose Criminal - Classroom6x unblocked game',
    url: 'Classroom6x/class-837.html',
    thumbnail: 'thumbnail/class-837.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-838',
    title: 'FNF Salty\'s Sunday Night',
    description: 'FNF Salty\'s Sunday Night - Classroom6x unblocked game',
    url: 'Classroom6x/class-838.html',
    thumbnail: 'thumbnail/class-838.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-839',
    title: 'FNF Vs Shaggy',
    description: 'FNF Vs Shaggy - Classroom6x unblocked game',
    url: 'Classroom6x/class-839.html',
    thumbnail: 'thumbnail/class-839.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-841',
    title: 'FNF StarCatcher',
    description: 'FNF StarCatcher - Classroom6x unblocked game',
    url: 'Classroom6x/class-841.html',
    thumbnail: 'thumbnail/class-841.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-842',
    title: 'FNF UpSide',
    description: 'FNF UpSide - Classroom6x unblocked game',
    url: 'Classroom6x/class-842.html',
    thumbnail: 'thumbnail/class-842.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-843',
    title: 'FNF Vs Void',
    description: 'FNF Vs Void - Classroom6x unblocked game',
    url: 'Classroom6x/class-843.html',
    thumbnail: 'thumbnail/class-843.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-844',
    title: 'FNF Week 6',
    description: 'FNF Week 6 - Classroom6x unblocked game',
    url: 'Classroom6x/class-844.html',
    thumbnail: 'thumbnail/class-844.png',
    category: 'Classroom6x'
  },
  {
    id: 'classroom6x-845',
    title: 'Flag Paint World Tour',
    description: 'Flag Paint World Tour - Classroom6x unblocked game',
    url: 'Classroom6x/class-845.html',
    thumbnail: 'thumbnail/class-845.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-846',
    title: 'My Perfect Hotel',
    description: 'My Perfect Hotel - Classroom6x unblocked game',
    url: 'Classroom6x/class-846.html',
    thumbnail: 'thumbnail/class-846.png',
    category: '3D'
  },
  {
    id: 'classroom6x-847',
    title: 'Animals Volleyball',
    description: 'Animals Volleyball - Classroom6x unblocked game',
    url: 'Classroom6x/class-847.html',
    thumbnail: 'thumbnail/class-847.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-848',
    title: 'Cafe Simulator',
    description: 'Cafe Simulator - Classroom6x unblocked game',
    url: 'Classroom6x/class-848.html',
    thumbnail: 'thumbnail/class-848.png',
    category: '3D'
  },
  {
    id: 'classroom6x-849',
    title: 'Nails Diy Manicure Master',
    description: 'Nails Diy Manicure Master - Classroom6x unblocked game',
    url: 'Classroom6x/class-849.html',
    thumbnail: 'thumbnail/class-849.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-850',
    title: 'Pixel Fishing',
    description: 'Pixel Fishing - Classroom6x unblocked game',
    url: 'Classroom6x/class-850.html',
    thumbnail: 'thumbnail/class-850.png',
    category: 'Simulation'
  },
  {
    id: 'classroom6x-851',
    title: 'Trial Mania',
    description: 'Trial Mania - Classroom6x unblocked game',
    url: 'Classroom6x/class-851.html',
    thumbnail: 'thumbnail/class-851.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-852',
    title: 'Simplyhoppers Io',
    description: 'Simplyhoppers Io - Classroom6x unblocked game',
    url: 'Classroom6x/class-852.html',
    thumbnail: 'thumbnail/class-852.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-853',
    title: 'Texasworm Io',
    description: 'Texasworm Io - Classroom6x unblocked game',
    url: 'Classroom6x/class-853.html',
    thumbnail: 'thumbnail/class-853.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-854',
    title: 'Zomblox Io',
    description: 'Zomblox Io - Classroom6x unblocked game',
    url: 'Classroom6x/class-854.html',
    thumbnail: 'thumbnail/class-854.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-855',
    title: 'Bunny Market',
    description: 'Bunny Market - Classroom6x unblocked game',
    url: 'Classroom6x/class-855.html',
    thumbnail: 'thumbnail/class-855.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-856',
    title: 'Blocky Blast Puzzle',
    description: 'Blocky Blast Puzzle - Classroom6x unblocked game',
    url: 'Classroom6x/class-856.html',
    thumbnail: 'thumbnail/class-856.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-857',
    title: 'Zombies Ate My Castle',
    description: 'Zombies Ate My Castle - Classroom6x unblocked game',
    url: 'Classroom6x/class-857.html',
    thumbnail: 'thumbnail/class-857.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-858',
    title: 'Chromagic',
    description: 'Chromagic - Classroom6x unblocked game',
    url: 'Classroom6x/class-858.html',
    thumbnail: 'thumbnail/class-858.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-859',
    title: 'Blumgi Racers',
    description: 'Blumgi Racers - Classroom6x unblocked game',
    url: 'Classroom6x/class-859.html',
    thumbnail: 'thumbnail/class-859.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-860',
    title: 'Drive Freedom',
    description: 'Drive Freedom - Classroom6x unblocked game',
    url: 'Classroom6x/class-860.html',
    thumbnail: 'thumbnail/class-860.png',
    category: '3D'
  },
  {
    id: 'classroom6x-862',
    title: 'Fear Response',
    description: 'Fear Response - Classroom6x unblocked game',
    url: 'Classroom6x/class-862.html',
    thumbnail: 'thumbnail/class-862.png',
    category: '3D'
  },
  {
    id: 'classroom6x-863',
    title: 'Rescue The Fish',
    description: 'Rescue The Fish - Classroom6x unblocked game',
    url: 'Classroom6x/class-863.html',
    thumbnail: 'thumbnail/class-863.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-864',
    title: 'Cannon Clash',
    description: 'Cannon Clash - Classroom6x unblocked game',
    url: 'Classroom6x/class-864.html',
    thumbnail: 'thumbnail/class-864.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-865',
    title: 'Euro Kick Tournament',
    description: 'Euro Kick Tournament - Classroom6x unblocked game',
    url: 'Classroom6x/class-865.html',
    thumbnail: 'thumbnail/class-865.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-866',
    title: 'Pizza Tower',
    description: 'Pizza Tower - Classroom6x unblocked game',
    url: 'Classroom6x/class-866.html',
    thumbnail: 'thumbnail/class-866.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-867',
    title: 'Pull The String',
    description: 'Pull The String - Classroom6x unblocked game',
    url: 'Classroom6x/class-867.html',
    thumbnail: 'thumbnail/class-867.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-868',
    title: 'Mophead Dash',
    description: 'Mophead Dash - Classroom6x unblocked game',
    url: 'Classroom6x/class-868.html',
    thumbnail: 'thumbnail/class-868.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-869',
    title: 'Disaster Arena',
    description: 'Disaster Arena - Classroom6x unblocked game',
    url: 'Classroom6x/class-869.html',
    thumbnail: 'thumbnail/class-869.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-870',
    title: 'Phox Forage',
    description: 'Phox Forage - Classroom6x unblocked game',
    url: 'Classroom6x/class-870.html',
    thumbnail: 'thumbnail/class-870.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-871',
    title: 'Blumgi Paintball',
    description: 'Blumgi Paintball - Classroom6x unblocked game',
    url: 'Classroom6x/class-871.html',
    thumbnail: 'thumbnail/class-871.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-872',
    title: 'Mine Line',
    description: 'Mine Line - Classroom6x unblocked game',
    url: 'Classroom6x/class-872.html',
    thumbnail: 'thumbnail/class-872.png',
    category: 'Simulation'
  },
  {
    id: 'classroom6x-873',
    title: 'Capyloop Stones',
    description: 'Capyloop Stones - Classroom6x unblocked game',
    url: 'Classroom6x/class-873.html',
    thumbnail: 'thumbnail/class-873.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-874',
    title: 'Forgotten Hill The Wardrobe 5',
    description: 'Forgotten Hill The Wardrobe 5 - Classroom6x unblocked game',
    url: 'Classroom6x/class-874.html',
    thumbnail: 'thumbnail/class-874.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-875',
    title: 'Fixing Time',
    description: 'Fixing Time - Classroom6x unblocked game',
    url: 'Classroom6x/class-875.html',
    thumbnail: 'thumbnail/class-875.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-876',
    title: 'Shadow Trick',
    description: 'Shadow Trick - Classroom6x unblocked game',
    url: 'Classroom6x/class-876.html',
    thumbnail: 'thumbnail/class-876.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-877',
    title: 'Forgotten Hill Surgery',
    description: 'Forgotten Hill Surgery - Classroom6x unblocked game',
    url: 'Classroom6x/class-877.html',
    thumbnail: 'thumbnail/class-877.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-878',
    title: 'Bubbleshooter',
    description: 'Bubbleshooter - Classroom6x unblocked game',
    url: 'Classroom6x/class-878.html',
    thumbnail: 'thumbnail/class-878.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-879',
    title: 'Bubbles 2',
    description: 'Bubbles 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-879.html',
    thumbnail: 'thumbnail/class-879.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-880',
    title: 'Bubble Shots',
    description: 'Bubble Shots - Classroom6x unblocked game',
    url: 'Classroom6x/class-880.html',
    thumbnail: 'thumbnail/class-880.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-881',
    title: 'Art Pixel Workshop',
    description: 'Art Pixel Workshop - Classroom6x unblocked game',
    url: 'Classroom6x/class-881.html',
    thumbnail: 'thumbnail/class-881.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-882',
    title: 'Temple Run 2 Spooky Summit',
    description: 'Temple Run 2 Spooky Summit - Classroom6x unblocked game',
    url: 'Classroom6x/class-882.html',
    thumbnail: 'thumbnail/class-882.png',
    category: '3D'
  },
  {
    id: 'classroom6x-883',
    title: 'Super Oscar',
    description: 'Super Oscar - Classroom6x unblocked game',
    url: 'Classroom6x/class-883.html',
    thumbnail: 'thumbnail/class-883.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-884',
    title: 'Graffiti Time',
    description: 'Graffiti Time - Classroom6x unblocked game',
    url: 'Classroom6x/class-884.html',
    thumbnail: 'thumbnail/class-884.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-885',
    title: 'Blightborne',
    description: 'Blightborne - Classroom6x unblocked game',
    url: 'Classroom6x/class-885.html',
    thumbnail: 'thumbnail/class-885.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-886',
    title: 'Smashy Duo',
    description: 'Smashy Duo - Classroom6x unblocked game',
    url: 'Classroom6x/class-886.html',
    thumbnail: 'thumbnail/class-886.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-887',
    title: 'Electric Highway',
    description: 'Electric Highway - Classroom6x unblocked game',
    url: 'Classroom6x/class-887.html',
    thumbnail: 'thumbnail/class-887.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-888',
    title: 'Circloo',
    description: 'Circloo - Classroom6x unblocked game',
    url: 'Classroom6x/class-888.html',
    thumbnail: 'thumbnail/class-888.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-889',
    title: 'Funny Battle Simulator',
    description: 'Funny Battle Simulator - Classroom6x unblocked game',
    url: 'Classroom6x/class-889.html',
    thumbnail: 'thumbnail/class-889.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-890',
    title: 'Color Car',
    description: 'Color Car - Classroom6x unblocked game',
    url: 'Classroom6x/class-890.html',
    thumbnail: 'thumbnail/class-890.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-891',
    title: 'Smash Car Idle 2',
    description: 'Smash Car Idle 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-891.html',
    thumbnail: 'thumbnail/class-891.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-892',
    title: 'Dasi Office Manager',
    description: 'Dasi Office Manager - Classroom6x unblocked game',
    url: 'Classroom6x/class-892.html',
    thumbnail: 'thumbnail/class-892.png',
    category: '3D'
  },
  {
    id: 'classroom6x-893',
    title: 'Hide And Seek Escape Games',
    description: 'Hide And Seek Escape Games - Classroom6x unblocked game',
    url: 'Classroom6x/class-893.html',
    thumbnail: 'thumbnail/class-893.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-894',
    title: 'School Escape Skip Games',
    description: 'School Escape Skip Games - Classroom6x unblocked game',
    url: 'Classroom6x/class-894.html',
    thumbnail: 'thumbnail/class-894.png',
    category: '3D'
  },
  {
    id: 'classroom6x-895',
    title: 'Snake Attack',
    description: 'Snake Attack - Classroom6x unblocked game',
    url: 'Classroom6x/class-895.html',
    thumbnail: 'thumbnail/class-895.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-896',
    title: 'Goober World',
    description: 'Goober World - Classroom6x unblocked game',
    url: 'Classroom6x/class-896.html',
    thumbnail: 'thumbnail/class-896.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-897',
    title: 'Mine Cartoon Cube World',
    description: 'Mine Cartoon Cube World - Classroom6x unblocked game',
    url: 'Classroom6x/class-897.html',
    thumbnail: 'thumbnail/class-897.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-898',
    title: 'Lidle Legend',
    description: 'Lidle Legend - Classroom6x unblocked game',
    url: 'Classroom6x/class-898.html',
    thumbnail: 'thumbnail/class-898.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-899',
    title: 'Super Dangerous Dungeons',
    description: 'Super Dangerous Dungeons - Classroom6x unblocked game',
    url: 'Classroom6x/class-899.html',
    thumbnail: 'thumbnail/class-899.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-902',
    title: 'Jelly Bounce 3d',
    description: 'Jelly Bounce 3d - Classroom6x unblocked game',
    url: 'Classroom6x/class-902.html',
    thumbnail: 'thumbnail/class-902.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-903',
    title: 'Just Tanks',
    description: 'Just Tanks - Classroom6x unblocked game',
    url: 'Classroom6x/class-903.html',
    thumbnail: 'thumbnail/class-903.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-904',
    title: 'Slime Rider',
    description: 'Slime Rider - Classroom6x unblocked game',
    url: 'Classroom6x/class-904.html',
    thumbnail: 'thumbnail/class-904.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-905',
    title: 'Klung',
    description: 'Klung - Classroom6x unblocked game',
    url: 'Classroom6x/class-905.html',
    thumbnail: 'thumbnail/class-905.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-906',
    title: 'Merge Gangster Cars',
    description: 'Merge Gangster Cars - Classroom6x unblocked game',
    url: 'Classroom6x/class-906.html',
    thumbnail: 'thumbnail/class-906.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-907',
    title: 'Mr Racer Car Racing',
    description: 'Mr Racer Car Racing - Classroom6x unblocked game',
    url: 'Classroom6x/class-907.html',
    thumbnail: 'thumbnail/class-907.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-908',
    title: 'Sticker Album',
    description: 'Sticker Album - Classroom6x unblocked game',
    url: 'Classroom6x/class-908.html',
    thumbnail: 'thumbnail/class-908.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-909',
    title: 'Kingdom Heroes',
    description: 'Kingdom Heroes - Classroom6x unblocked game',
    url: 'Classroom6x/class-909.html',
    thumbnail: 'thumbnail/class-909.png',
    category: '3D'
  },
  {
    id: 'classroom6x-910',
    title: 'Hide Ball Brain Teaser',
    description: 'Hide Ball Brain Teaser - Classroom6x unblocked game',
    url: 'Classroom6x/class-910.html',
    thumbnail: 'thumbnail/class-910.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-911',
    title: 'Sprint League',
    description: 'Sprint League - Classroom6x unblocked game',
    url: 'Classroom6x/class-911.html',
    thumbnail: 'thumbnail/class-911.png',
    category: '3D'
  },
  {
    id: 'classroom6x-912',
    title: 'Not Not',
    description: 'Not Not - Classroom6x unblocked game',
    url: 'Classroom6x/class-912.html',
    thumbnail: 'thumbnail/class-912.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-913',
    title: 'Driverz Ed',
    description: 'Driverz Ed - Classroom6x unblocked game',
    url: 'Classroom6x/class-913.html',
    thumbnail: 'thumbnail/class-913.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-914',
    title: 'Power Wash Cleanup',
    description: 'Power Wash Cleanup - Classroom6x unblocked game',
    url: 'Classroom6x/class-914.html',
    thumbnail: 'thumbnail/class-914.png',
    category: '3D'
  },
  {
    id: 'classroom6x-915',
    title: 'Cactu Sama 2',
    description: 'Cactu Sama 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-915.html',
    thumbnail: 'thumbnail/class-915.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-916',
    title: 'Fox Adventurer',
    description: 'Fox Adventurer - Classroom6x unblocked game',
    url: 'Classroom6x/class-916.html',
    thumbnail: 'thumbnail/class-916.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-917',
    title: 'Parakite Ninja',
    description: 'Parakite Ninja - Classroom6x unblocked game',
    url: 'Classroom6x/class-917.html',
    thumbnail: 'thumbnail/class-917.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-918',
    title: 'Frostbite',
    description: 'Frostbite - Classroom6x unblocked game',
    url: 'Classroom6x/class-918.html',
    thumbnail: 'thumbnail/class-918.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-919',
    title: 'Apple Knight Golf',
    description: 'Apple Knight Golf - Classroom6x unblocked game',
    url: 'Classroom6x/class-919.html',
    thumbnail: 'thumbnail/class-919.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-920',
    title: 'Burrito Bison Revenge',
    description: 'Burrito Bison Revenge - Classroom6x unblocked game',
    url: 'Classroom6x/class-920.html',
    thumbnail: 'thumbnail/class-920.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-921',
    title: 'Toxic 2',
    description: 'Toxic 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-921.html',
    thumbnail: 'thumbnail/class-921.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-922',
    title: 'Squish Machine',
    description: 'Squish Machine - Classroom6x unblocked game',
    url: 'Classroom6x/class-922.html',
    thumbnail: 'thumbnail/class-922.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-924',
    title: 'Ping Pong Go',
    description: 'Ping Pong Go - Classroom6x unblocked game',
    url: 'Classroom6x/class-924.html',
    thumbnail: 'thumbnail/class-924.png',
    category: '3D'
  },
  {
    id: 'classroom6x-925',
    title: 'Block Toggle',
    description: 'Block Toggle - Classroom6x unblocked game',
    url: 'Classroom6x/class-925.html',
    thumbnail: 'thumbnail/class-925.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-926',
    title: 'Mutazone',
    description: 'Mutazone - Classroom6x unblocked game',
    url: 'Classroom6x/class-926.html',
    thumbnail: 'thumbnail/class-926.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-927',
    title: 'Eat The World',
    description: 'Eat The World - Classroom6x unblocked game',
    url: 'Classroom6x/class-927.html',
    thumbnail: 'thumbnail/class-927.png',
    category: '3D'
  },
  {
    id: 'classroom6x-928',
    title: 'Quivershot',
    description: 'Quivershot - Classroom6x unblocked game',
    url: 'Classroom6x/class-928.html',
    thumbnail: 'thumbnail/class-928.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-929',
    title: 'Robox',
    description: 'Robox - Classroom6x unblocked game',
    url: 'Classroom6x/class-929.html',
    thumbnail: 'thumbnail/class-929.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-930',
    title: 'Steve And The Duck Shooter',
    description: 'Steve And The Duck Shooter - Classroom6x unblocked game',
    url: 'Classroom6x/class-930.html',
    thumbnail: 'thumbnail/class-930.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-931',
    title: 'Cherry On The Cake',
    description: 'Cherry On The Cake - Classroom6x unblocked game',
    url: 'Classroom6x/class-931.html',
    thumbnail: 'thumbnail/class-931.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-932',
    title: '4th And Goal 2019',
    description: '4th And Goal 2019 - Classroom6x unblocked game',
    url: 'Classroom6x/class-932.html',
    thumbnail: 'thumbnail/class-932.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-933',
    title: 'Off The Rails',
    description: 'Off The Rails - Classroom6x unblocked game',
    url: 'Classroom6x/class-933.html',
    thumbnail: 'thumbnail/class-933.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-934',
    title: 'Ninja Action 2',
    description: 'Ninja Action 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-934.html',
    thumbnail: 'thumbnail/class-934.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-935',
    title: 'Shift To Drift',
    description: 'Shift To Drift - Classroom6x unblocked game',
    url: 'Classroom6x/class-935.html',
    thumbnail: 'thumbnail/class-935.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-936',
    title: 'Zombroad',
    description: 'Zombroad - Classroom6x unblocked game',
    url: 'Classroom6x/class-936.html',
    thumbnail: 'thumbnail/class-936.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-937',
    title: 'Crush It',
    description: 'Crush It - Classroom6x unblocked game',
    url: 'Classroom6x/class-937.html',
    thumbnail: 'thumbnail/class-937.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-938',
    title: 'Quick Gun',
    description: 'Quick Gun - Classroom6x unblocked game',
    url: 'Classroom6x/class-938.html',
    thumbnail: 'thumbnail/class-938.png',
    category: '3D'
  },
  {
    id: 'classroom6x-939',
    title: 'Dunkers 2',
    description: 'Dunkers 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-939.html',
    thumbnail: 'thumbnail/class-939.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-940',
    title: 'Fidget Spinner High Score',
    description: 'Fidget Spinner High Score - Classroom6x unblocked game',
    url: 'Classroom6x/class-940.html',
    thumbnail: 'thumbnail/class-940.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-941',
    title: 'Freeway Fury 3',
    description: 'Freeway Fury 3 - Classroom6x unblocked game',
    url: 'Classroom6x/class-941.html',
    thumbnail: 'thumbnail/class-941.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-942',
    title: 'Bowling Champion',
    description: 'Bowling Champion - Classroom6x unblocked game',
    url: 'Classroom6x/class-942.html',
    thumbnail: 'thumbnail/class-942.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-943',
    title: 'The Speed Ninja',
    description: 'The Speed Ninja - Classroom6x unblocked game',
    url: 'Classroom6x/class-943.html',
    thumbnail: 'thumbnail/class-943.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-944',
    title: 'Bottle Flip Challenge',
    description: 'Bottle Flip Challenge - Classroom6x unblocked game',
    url: 'Classroom6x/class-944.html',
    thumbnail: 'thumbnail/class-944.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-945',
    title: 'Short Life 2',
    description: 'Short Life 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-945.html',
    thumbnail: 'thumbnail/class-945.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-946',
    title: 'Brushbattle',
    description: 'Brushbattle - Classroom6x unblocked game',
    url: 'Classroom6x/class-946.html',
    thumbnail: 'thumbnail/class-946.png',
    category: 'Multiplayer'
  },
  {
    id: 'classroom6x-947',
    title: 'Stickman Archers Waves',
    description: 'Stickman Archers Waves - Classroom6x unblocked game',
    url: 'Classroom6x/class-947.html',
    thumbnail: 'thumbnail/class-947.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-948',
    title: 'Stunt Bike Extreme',
    description: 'Stunt Bike Extreme - Classroom6x unblocked game',
    url: 'Classroom6x/class-948.html',
    thumbnail: 'thumbnail/class-948.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-949',
    title: 'Icy Purple Head 2',
    description: 'Icy Purple Head 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-949.html',
    thumbnail: 'thumbnail/class-949.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-950',
    title: 'Penalty Shooters X',
    description: 'Penalty Shooters X - Classroom6x unblocked game',
    url: 'Classroom6x/class-950.html',
    thumbnail: 'thumbnail/class-950.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-951',
    title: 'Sugar Sugar Html5',
    description: 'Sugar Sugar Html5 - Classroom6x unblocked game',
    url: 'Classroom6x/class-951.html',
    thumbnail: 'thumbnail/class-951.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-952',
    title: 'Hit The Fan',
    description: 'Hit The Fan - Classroom6x unblocked game',
    url: 'Classroom6x/class-952.html',
    thumbnail: 'thumbnail/class-952.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-953',
    title: 'Johnny Trigger Action Shooter',
    description: 'Johnny Trigger Action Shooter - Classroom6x unblocked game',
    url: 'Classroom6x/class-953.html',
    thumbnail: 'thumbnail/class-953.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-954',
    title: 'Too Many Ninjas',
    description: 'Too Many Ninjas - Classroom6x unblocked game',
    url: 'Classroom6x/class-954.html',
    thumbnail: 'thumbnail/class-954.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-955',
    title: 'Serious Scramblers',
    description: 'Serious Scramblers - Classroom6x unblocked game',
    url: 'Classroom6x/class-955.html',
    thumbnail: 'thumbnail/class-955.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-956',
    title: 'Flip Hero Io',
    description: 'Flip Hero Io - Classroom6x unblocked game',
    url: 'Classroom6x/class-956.html',
    thumbnail: 'thumbnail/class-956.png',
    category: 'Multiplayer'
  },
  {
    id: 'classroom6x-957',
    title: 'Dodge Blast',
    description: 'Dodge Blast - Classroom6x unblocked game',
    url: 'Classroom6x/class-957.html',
    thumbnail: 'thumbnail/class-957.png',
    category: 'Racing'
  },
  {
    id: 'classroom6x-958',
    title: 'Crazy Platez',
    description: 'Crazy Platez - Classroom6x unblocked game',
    url: 'Classroom6x/class-958.html',
    thumbnail: 'thumbnail/class-958.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-959',
    title: 'Mad Day 2',
    description: 'Mad Day 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-959.html',
    thumbnail: 'thumbnail/class-959.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-960',
    title: 'Survival Race',
    description: 'Survival Race - Classroom6x unblocked game',
    url: 'Classroom6x/class-960.html',
    thumbnail: 'thumbnail/class-960.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-961',
    title: 'Gear Madness',
    description: 'Gear Madness - Classroom6x unblocked game',
    url: 'Classroom6x/class-961.html',
    thumbnail: 'thumbnail/class-961.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-962',
    title: 'Crazy Freekick',
    description: 'Crazy Freekick - Classroom6x unblocked game',
    url: 'Classroom6x/class-962.html',
    thumbnail: 'thumbnail/class-962.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-963',
    title: 'Ultimate Swish',
    description: 'Ultimate Swish - Classroom6x unblocked game',
    url: 'Classroom6x/class-963.html',
    thumbnail: 'thumbnail/class-963.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-964',
    title: 'Badminton Stars',
    description: 'Badminton Stars - Classroom6x unblocked game',
    url: 'Classroom6x/class-964.html',
    thumbnail: 'thumbnail/class-964.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-965',
    title: 'Cricket Hero',
    description: 'Cricket Hero - Classroom6x unblocked game',
    url: 'Classroom6x/class-965.html',
    thumbnail: 'thumbnail/class-965.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-966',
    title: 'Real Tennis',
    description: 'Real Tennis - Classroom6x unblocked game',
    url: 'Classroom6x/class-966.html',
    thumbnail: 'thumbnail/class-966.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-967',
    title: 'Streetfight King Of The Gang',
    description: 'Streetfight King Of The Gang - Classroom6x unblocked game',
    url: 'Classroom6x/class-967.html',
    thumbnail: 'thumbnail/class-967.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-968',
    title: '4th And Goal 2018',
    description: '4th And Goal 2018 - Classroom6x unblocked game',
    url: 'Classroom6x/class-968.html',
    thumbnail: 'thumbnail/class-968.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-969',
    title: 'Watercraft Rush',
    description: 'Watercraft Rush - Classroom6x unblocked game',
    url: 'Classroom6x/class-969.html',
    thumbnail: 'thumbnail/class-969.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-970',
    title: 'Tennis Hero',
    description: 'Tennis Hero - Classroom6x unblocked game',
    url: 'Classroom6x/class-970.html',
    thumbnail: 'thumbnail/class-970.png',
    category: '3D'
  },
  {
    id: 'classroom6x-971',
    title: 'Xtreme Furball',
    description: 'Xtreme Furball - Classroom6x unblocked game',
    url: 'Classroom6x/class-971.html',
    thumbnail: 'thumbnail/class-971.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-972',
    title: 'Hockeystars',
    description: 'Hockeystars - Classroom6x unblocked game',
    url: 'Classroom6x/class-972.html',
    thumbnail: 'thumbnail/class-972.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-973',
    title: 'Street Dribble',
    description: 'Street Dribble - Classroom6x unblocked game',
    url: 'Classroom6x/class-973.html',
    thumbnail: 'thumbnail/class-973.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-974',
    title: '4th And Goal 2023',
    description: '4th And Goal 2023 - Classroom6x unblocked game',
    url: 'Classroom6x/class-974.html',
    thumbnail: 'thumbnail/class-974.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-975',
    title: 'Goal Training',
    description: 'Goal Training - Classroom6x unblocked game',
    url: 'Classroom6x/class-975.html',
    thumbnail: 'thumbnail/class-975.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-976',
    title: 'Supercars Royale',
    description: 'Supercars Royale - Classroom6x unblocked game',
    url: 'Classroom6x/class-976.html',
    thumbnail: 'thumbnail/class-976.png',
    category: 'Car'
  },
  {
    id: 'classroom6x-977',
    title: 'Parkour Jump',
    description: 'Parkour Jump - Classroom6x unblocked game',
    url: 'Classroom6x/class-977.html',
    thumbnail: 'thumbnail/class-977.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-978',
    title: 'Combat Reloaded 2',
    description: 'Combat Reloaded 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-978.html',
    thumbnail: 'thumbnail/class-978.png',
    category: '3D'
  },
  {
    id: 'classroom6x-979',
    title: 'Superhot Prototype',
    description: 'Superhot Prototype - Classroom6x unblocked game',
    url: 'Classroom6x/class-979.html',
    thumbnail: 'thumbnail/class-979.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-981',
    title: 'Elysian',
    description: 'Elysian - Classroom6x unblocked game',
    url: 'Classroom6x/class-981.html',
    thumbnail: 'thumbnail/class-981.png',
    category: '3D'
  },
  {
    id: 'classroom6x-982',
    title: 'Stick Rush',
    description: 'Stick Rush - Classroom6x unblocked game',
    url: 'Classroom6x/class-982.html',
    thumbnail: 'thumbnail/class-982.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-983',
    title: 'Stickman Kingdom Clash',
    description: 'Stickman Kingdom Clash - Classroom6x unblocked game',
    url: 'Classroom6x/class-983.html',
    thumbnail: 'thumbnail/class-983.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-984',
    title: 'A Long Way Home',
    description: 'A Long Way Home - Classroom6x unblocked game',
    url: 'Classroom6x/class-984.html',
    thumbnail: 'thumbnail/class-984.png',
    category: '3D'
  },
  {
    id: 'classroom6x-985',
    title: 'Swipe Basketball',
    description: 'Swipe Basketball - Classroom6x unblocked game',
    url: 'Classroom6x/class-985.html',
    thumbnail: 'thumbnail/class-985.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-986',
    title: 'Flicking Soccer',
    description: 'Flicking Soccer - Classroom6x unblocked game',
    url: 'Classroom6x/class-986.html',
    thumbnail: 'thumbnail/class-986.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-987',
    title: 'Grand Mini Slam',
    description: 'Grand Mini Slam - Classroom6x unblocked game',
    url: 'Classroom6x/class-987.html',
    thumbnail: 'thumbnail/class-987.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-988',
    title: 'Cyberpunk Ninja Runner',
    description: 'Cyberpunk Ninja Runner - Classroom6x unblocked game',
    url: 'Classroom6x/class-988.html',
    thumbnail: 'thumbnail/class-988.png',
    category: '3D'
  },
  {
    id: 'classroom6x-989',
    title: 'Let Will Grigg Play',
    description: 'Let Will Grigg Play - Classroom6x unblocked game',
    url: 'Classroom6x/class-989.html',
    thumbnail: 'thumbnail/class-989.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-990',
    title: 'Totems Of Tag',
    description: 'Totems Of Tag - Classroom6x unblocked game',
    url: 'Classroom6x/class-990.html',
    thumbnail: 'thumbnail/class-990.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-991',
    title: 'Minibattles Survivor',
    description: 'Minibattles Survivor - Classroom6x unblocked game',
    url: 'Classroom6x/class-991.html',
    thumbnail: 'thumbnail/class-991.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-992',
    title: 'Race Madness',
    description: 'Race Madness - Classroom6x unblocked game',
    url: 'Classroom6x/class-992.html',
    thumbnail: 'thumbnail/class-992.png',
    category: '3D'
  },
  {
    id: 'classroom6x-993',
    title: 'Connect Puzzle',
    description: 'Connect Puzzle - Classroom6x unblocked game',
    url: 'Classroom6x/class-993.html',
    thumbnail: 'thumbnail/class-993.png',
    category: 'Girls'
  },
  {
    id: 'classroom6x-995',
    title: 'Nuts And Bolts Screwing Puzzle',
    description: 'Nuts And Bolts Screwing Puzzle - Classroom6x unblocked game',
    url: 'Classroom6x/class-995.html',
    thumbnail: 'thumbnail/class-995.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-996',
    title: 'Brain Test Allstar',
    description: 'Brain Test Allstar - Classroom6x unblocked game',
    url: 'Classroom6x/class-996.html',
    thumbnail: 'thumbnail/class-996.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-997',
    title: 'London Jigsaw Puzzle',
    description: 'London Jigsaw Puzzle - Classroom6x unblocked game',
    url: 'Classroom6x/class-997.html',
    thumbnail: 'thumbnail/class-997.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-998',
    title: 'Chess Multiplayer',
    description: 'Chess Multiplayer - Classroom6x unblocked game',
    url: 'Classroom6x/class-998.html',
    thumbnail: 'thumbnail/class-998.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-999',
    title: 'Zombies Vs Finger',
    description: 'Zombies Vs Finger - Classroom6x unblocked game',
    url: 'Classroom6x/class-999.html',
    thumbnail: 'thumbnail/class-999.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1000',
    title: 'Angry Zombie',
    description: 'Angry Zombie - Classroom6x unblocked game',
    url: 'Classroom6x/class-1000.html',
    thumbnail: 'thumbnail/class-1000.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1001',
    title: 'Zombie Cows',
    description: 'Zombie Cows - Classroom6x unblocked game',
    url: 'Classroom6x/class-1001.html',
    thumbnail: 'thumbnail/class-1001.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1002',
    title: 'Spent Shells',
    description: 'Spent Shells - Classroom6x unblocked game',
    url: 'Classroom6x/class-1002.html',
    thumbnail: 'thumbnail/class-1002.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1003',
    title: 'Super Killboi 9000',
    description: 'Super Killboi 9000 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1003.html',
    thumbnail: 'thumbnail/class-1003.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1004',
    title: 'Fantasy Sandbox',
    description: 'Fantasy Sandbox - Classroom6x unblocked game',
    url: 'Classroom6x/class-1004.html',
    thumbnail: 'thumbnail/class-1004.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1005',
    title: 'Viking Village',
    description: 'Viking Village - Classroom6x unblocked game',
    url: 'Classroom6x/class-1005.html',
    thumbnail: 'thumbnail/class-1005.png',
    category: '3D'
  },
  {
    id: 'classroom6x-1006',
    title: 'Base Defense 2',
    description: 'Base Defense 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1006.html',
    thumbnail: 'thumbnail/class-1006.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1007',
    title: 'Base Defense',
    description: 'Base Defense - Classroom6x unblocked game',
    url: 'Classroom6x/class-1007.html',
    thumbnail: 'thumbnail/class-1007.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1008',
    title: 'Toca Boca',
    description: 'Toca Boca - Classroom6x unblocked game',
    url: 'Classroom6x/class-1008.html',
    thumbnail: 'thumbnail/class-1008.png',
    category: '3D'
  },
  {
    id: 'classroom6x-1009',
    title: 'Sprunki',
    description: 'Sprunki - Classroom6x unblocked game',
    url: 'Classroom6x/class-1009.html',
    thumbnail: 'thumbnail/class-1009.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-1010',
    title: 'Basket Monsterz',
    description: 'Basket Monsterz - Classroom6x unblocked game',
    url: 'Classroom6x/class-1010.html',
    thumbnail: 'thumbnail/class-1010.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-1011',
    title: 'Mad Scientist Clicker Idle Crazy Inc',
    description: 'Mad Scientist Clicker Idle Crazy Inc - Classroom6x unblocked game',
    url: 'Classroom6x/class-1011.html',
    thumbnail: 'thumbnail/class-1011.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1012',
    title: 'Fantasy Merger',
    description: 'Fantasy Merger - Classroom6x unblocked game',
    url: 'Classroom6x/class-1012.html',
    thumbnail: 'thumbnail/class-1012.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1013',
    title: 'Tail Swing',
    description: 'Tail Swing - Classroom6x unblocked game',
    url: 'Classroom6x/class-1013.html',
    thumbnail: 'thumbnail/class-1013.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1014',
    title: 'Idle Gang',
    description: 'Idle Gang - Classroom6x unblocked game',
    url: 'Classroom6x/class-1014.html',
    thumbnail: 'thumbnail/class-1014.png',
    category: '3D'
  },
  {
    id: 'classroom6x-1015',
    title: 'Kingpin Bowling',
    description: 'Kingpin Bowling - Classroom6x unblocked game',
    url: 'Classroom6x/class-1015.html',
    thumbnail: 'thumbnail/class-1015.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1016',
    title: 'Idle Money Tree',
    description: 'Idle Money Tree - Classroom6x unblocked game',
    url: 'Classroom6x/class-1016.html',
    thumbnail: 'thumbnail/class-1016.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1017',
    title: 'Idle Light City',
    description: 'Idle Light City - Classroom6x unblocked game',
    url: 'Classroom6x/class-1017.html',
    thumbnail: 'thumbnail/class-1017.png',
    category: '3D'
  },
  {
    id: 'classroom6x-1018',
    title: 'Idle Farming Business',
    description: 'Idle Farming Business - Classroom6x unblocked game',
    url: 'Classroom6x/class-1018.html',
    thumbnail: 'thumbnail/class-1018.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1019',
    title: 'Dungeon Miner',
    description: 'Dungeon Miner - Classroom6x unblocked game',
    url: 'Classroom6x/class-1019.html',
    thumbnail: 'thumbnail/class-1019.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1020',
    title: 'Spaceship Merge',
    description: 'Spaceship Merge - Classroom6x unblocked game',
    url: 'Classroom6x/class-1020.html',
    thumbnail: 'thumbnail/class-1020.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1021',
    title: 'Idle Tree City',
    description: 'Idle Tree City - Classroom6x unblocked game',
    url: 'Classroom6x/class-1021.html',
    thumbnail: 'thumbnail/class-1021.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1022',
    title: 'Minimissions',
    description: 'Minimissions - Classroom6x unblocked game',
    url: 'Classroom6x/class-1022.html',
    thumbnail: 'thumbnail/class-1022.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1023',
    title: 'Horror Nights Story',
    description: 'Horror Nights Story - Classroom6x unblocked game',
    url: 'Classroom6x/class-1023.html',
    thumbnail: 'thumbnail/class-1023.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1024',
    title: 'Tower Crush',
    description: 'Tower Crush - Classroom6x unblocked game',
    url: 'Classroom6x/class-1024.html',
    thumbnail: 'thumbnail/class-1024.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1025',
    title: 'Gobattle',
    description: 'Gobattle - Classroom6x unblocked game',
    url: 'Classroom6x/class-1025.html',
    thumbnail: 'thumbnail/class-1025.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-1026',
    title: 'American Football Challenge',
    description: 'American Football Challenge - Classroom6x unblocked game',
    url: 'Classroom6x/class-1026.html',
    thumbnail: 'thumbnail/class-1026.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-1027',
    title: 'Forgotten Hill Fall Html5',
    description: 'Forgotten Hill Fall Html5 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1027.html',
    thumbnail: 'thumbnail/class-1027.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1028',
    title: 'Sword Masters',
    description: 'Sword Masters - Classroom6x unblocked game',
    url: 'Classroom6x/class-1028.html',
    thumbnail: 'thumbnail/class-1028.png',
    category: '3D'
  },
  {
    id: 'classroom6x-1029',
    title: 'Tower Defense Super Heroes',
    description: 'Tower Defense Super Heroes - Classroom6x unblocked game',
    url: 'Classroom6x/class-1029.html',
    thumbnail: 'thumbnail/class-1029.png',
    category: 'Strategy'
  },
  {
    id: 'classroom6x-1030',
    title: 'Laser Blade 3000',
    description: 'Laser Blade 3000 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1030.html',
    thumbnail: 'thumbnail/class-1030.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-1031',
    title: 'Mafia Billiard Tricks',
    description: 'Mafia Billiard Tricks - Classroom6x unblocked game',
    url: 'Classroom6x/class-1031.html',
    thumbnail: 'thumbnail/class-1031.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-1032',
    title: 'Stud Rider',
    description: 'Stud Rider - Classroom6x unblocked game',
    url: 'Classroom6x/class-1032.html',
    thumbnail: 'thumbnail/class-1032.png',
    category: 'Moto'
  },
  {
    id: 'classroom6x-1033',
    title: 'Clash Of Armour',
    description: 'Clash Of Armour - Classroom6x unblocked game',
    url: 'Classroom6x/class-1033.html',
    thumbnail: 'thumbnail/class-1033.png',
    category: 'Strategy'
  },
  {
    id: 'classroom6x-1034',
    title: 'Crazy Pig Simulator',
    description: 'Crazy Pig Simulator - Classroom6x unblocked game',
    url: 'Classroom6x/class-1034.html',
    thumbnail: 'thumbnail/class-1034.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1035',
    title: 'Slash The Rope',
    description: 'Slash The Rope - Classroom6x unblocked game',
    url: 'Classroom6x/class-1035.html',
    thumbnail: 'thumbnail/class-1035.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1036',
    title: 'Final Ninja Zero Html5',
    description: 'Final Ninja Zero Html5 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1036.html',
    thumbnail: 'thumbnail/class-1036.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1037',
    title: 'Tower Defense Mingling',
    description: 'Tower Defense Mingling - Classroom6x unblocked game',
    url: 'Classroom6x/class-1037.html',
    thumbnail: 'thumbnail/class-1037.png',
    category: '3D'
  },
  {
    id: 'classroom6x-1038',
    title: 'Swingers',
    description: 'Swingers - Classroom6x unblocked game',
    url: 'Classroom6x/class-1038.html',
    thumbnail: 'thumbnail/class-1038.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1039',
    title: 'Castle Pals',
    description: 'Castle Pals - Classroom6x unblocked game',
    url: 'Classroom6x/class-1039.html',
    thumbnail: 'thumbnail/class-1039.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1040',
    title: 'Samsara',
    description: 'Samsara - Classroom6x unblocked game',
    url: 'Classroom6x/class-1040.html',
    thumbnail: 'thumbnail/class-1040.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1042',
    title: 'Shovel Pirate',
    description: 'Shovel Pirate - Classroom6x unblocked game',
    url: 'Classroom6x/class-1042.html',
    thumbnail: 'thumbnail/class-1042.png',
    category: '2 Player'
  },
  {
    id: 'classroom6x-1043',
    title: 'Eggys Big Adventure',
    description: 'Eggys Big Adventure - Classroom6x unblocked game',
    url: 'Classroom6x/class-1043.html',
    thumbnail: 'thumbnail/class-1043.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1044',
    title: '4th And Goal 2020',
    description: '4th And Goal 2020 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1044.html',
    thumbnail: 'thumbnail/class-1044.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1045',
    title: '4th And Goal 2024',
    description: '4th And Goal 2024 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1045.html',
    thumbnail: 'thumbnail/class-1045.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1046',
    title: 'Penalty Superstar',
    description: 'Penalty Superstar - Classroom6x unblocked game',
    url: 'Classroom6x/class-1046.html',
    thumbnail: 'thumbnail/class-1046.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-1047',
    title: 'Baseball Kid Pitcher Cup',
    description: 'Baseball Kid Pitcher Cup - Classroom6x unblocked game',
    url: 'Classroom6x/class-1047.html',
    thumbnail: 'thumbnail/class-1047.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-1048',
    title: 'Touchdown Rush',
    description: 'Touchdown Rush - Classroom6x unblocked game',
    url: 'Classroom6x/class-1048.html',
    thumbnail: 'thumbnail/class-1048.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-1049',
    title: 'Goalkeeper Challenge',
    description: 'Goalkeeper Challenge - Classroom6x unblocked game',
    url: 'Classroom6x/class-1049.html',
    thumbnail: 'thumbnail/class-1049.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-1050',
    title: 'Blumgi Soccer',
    description: 'Blumgi Soccer - Classroom6x unblocked game',
    url: 'Classroom6x/class-1050.html',
    thumbnail: 'thumbnail/class-1050.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1051',
    title: 'Footballwars Online',
    description: 'Footballwars Online - Classroom6x unblocked game',
    url: 'Classroom6x/class-1051.html',
    thumbnail: 'thumbnail/class-1051.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-1052',
    title: 'Swimming Pro',
    description: 'Swimming Pro - Classroom6x unblocked game',
    url: 'Classroom6x/class-1052.html',
    thumbnail: 'thumbnail/class-1052.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-1053',
    title: 'Ultimate Boxing',
    description: 'Ultimate Boxing - Classroom6x unblocked game',
    url: 'Classroom6x/class-1053.html',
    thumbnail: 'thumbnail/class-1053.png',
    category: 'Sports'
  },
  {
    id: 'classroom6x-1054',
    title: 'Golf Zero',
    description: 'Golf Zero - Classroom6x unblocked game',
    url: 'Classroom6x/class-1054.html',
    thumbnail: 'thumbnail/class-1054.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1055',
    title: 'Sling World Cup',
    description: 'Sling World Cup - Classroom6x unblocked game',
    url: 'Classroom6x/class-1055.html',
    thumbnail: 'thumbnail/class-1055.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-1056',
    title: 'Rotatez',
    description: 'Rotatez - Classroom6x unblocked game',
    url: 'Classroom6x/class-1056.html',
    thumbnail: 'thumbnail/class-1056.png',
    category: '3D'
  },
  {
    id: 'classroom6x-1057',
    title: 'Cave Chaos 2',
    description: 'Cave Chaos 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1057.html',
    thumbnail: 'thumbnail/class-1057.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1058',
    title: 'Senya And Oscar 2',
    description: 'Senya And Oscar 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1058.html',
    thumbnail: 'thumbnail/class-1058.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1059',
    title: 'Biker Street',
    description: 'Biker Street - Classroom6x unblocked game',
    url: 'Classroom6x/class-1059.html',
    thumbnail: 'thumbnail/class-1059.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1060',
    title: 'Scary Maze',
    description: 'Scary Maze - Classroom6x unblocked game',
    url: 'Classroom6x/class-1060.html',
    thumbnail: 'thumbnail/class-1060.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1061',
    title: 'Portrait Of An Obsession',
    description: 'Portrait Of An Obsession - Classroom6x unblocked game',
    url: 'Classroom6x/class-1061.html',
    thumbnail: 'thumbnail/class-1061.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1062',
    title: 'Old Towers',
    description: 'Old Towers - Classroom6x unblocked game',
    url: 'Classroom6x/class-1062.html',
    thumbnail: 'thumbnail/class-1062.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1063',
    title: 'Car Eats Car Sea Adventure',
    description: 'Car Eats Car Sea Adventure - Classroom6x unblocked game',
    url: 'Classroom6x/class-1063.html',
    thumbnail: 'thumbnail/class-1063.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1064',
    title: 'Boost Buddies',
    description: 'Boost Buddies - Classroom6x unblocked game',
    url: 'Classroom6x/class-1064.html',
    thumbnail: 'thumbnail/class-1064.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-1065',
    title: 'Big Tower Tiny Square 2',
    description: 'Big Tower Tiny Square 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1065.html',
    thumbnail: 'thumbnail/class-1065.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-1066',
    title: 'Mekabolt',
    description: 'Mekabolt - Classroom6x unblocked game',
    url: 'Classroom6x/class-1066.html',
    thumbnail: 'thumbnail/class-1066.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1067',
    title: 'Ground Digger',
    description: 'Ground Digger - Classroom6x unblocked game',
    url: 'Classroom6x/class-1067.html',
    thumbnail: 'thumbnail/class-1067.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-1068',
    title: 'Breakoid',
    description: 'Breakoid - Classroom6x unblocked game',
    url: 'Classroom6x/class-1068.html',
    thumbnail: 'thumbnail/class-1068.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-1070',
    title: 'Test Subject Blue',
    description: 'Test Subject Blue - Classroom6x unblocked game',
    url: 'Classroom6x/class-1070.html',
    thumbnail: 'thumbnail/class-1070.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-1071',
    title: 'Toxic',
    description: 'Toxic - Classroom6x unblocked game',
    url: 'Classroom6x/class-1071.html',
    thumbnail: 'thumbnail/class-1071.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-1072',
    title: 'Firefighter Pinball',
    description: 'Firefighter Pinball - Classroom6x unblocked game',
    url: 'Classroom6x/class-1072.html',
    thumbnail: 'thumbnail/class-1072.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-1074',
    title: 'Big Neon Tower Vs Tiny Square',
    description: 'Big Neon Tower Vs Tiny Square - Classroom6x unblocked game',
    url: 'Classroom6x/class-1074.html',
    thumbnail: 'thumbnail/class-1074.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-1075',
    title: 'Battleships Armada',
    description: 'Battleships Armada - Classroom6x unblocked game',
    url: 'Classroom6x/class-1075.html',
    thumbnail: 'thumbnail/class-1075.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-1076',
    title: 'Bouncy Woods',
    description: 'Bouncy Woods - Classroom6x unblocked game',
    url: 'Classroom6x/class-1076.html',
    thumbnail: 'thumbnail/class-1076.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1077',
    title: 'Reversi',
    description: 'Reversi - Classroom6x unblocked game',
    url: 'Classroom6x/class-1077.html',
    thumbnail: 'thumbnail/class-1077.png',
    category: 'Board'
  },
  {
    id: 'classroom6x-1078',
    title: 'Zombie Dying Survival Days',
    description: 'Zombie Dying Survival Days - Classroom6x unblocked game',
    url: 'Classroom6x/class-1078.html',
    thumbnail: 'thumbnail/class-1078.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1079',
    title: 'Pirate Heroes Sea Battles',
    description: 'Pirate Heroes Sea Battles - Classroom6x unblocked game',
    url: 'Classroom6x/class-1079.html',
    thumbnail: 'thumbnail/class-1079.png',
    category: '3D'
  },
  {
    id: 'classroom6x-1080',
    title: 'Hefty Shaman Deluxe',
    description: 'Hefty Shaman Deluxe - Classroom6x unblocked game',
    url: 'Classroom6x/class-1080.html',
    thumbnail: 'thumbnail/class-1080.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1081',
    title: 'Kamaeru Mini',
    description: 'Kamaeru Mini - Classroom6x unblocked game',
    url: 'Classroom6x/class-1081.html',
    thumbnail: 'thumbnail/class-1081.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1082',
    title: 'Snow Tale',
    description: 'Snow Tale - Classroom6x unblocked game',
    url: 'Classroom6x/class-1082.html',
    thumbnail: 'thumbnail/class-1082.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1083',
    title: 'Twin Shot',
    description: 'Twin Shot - Classroom6x unblocked game',
    url: 'Classroom6x/class-1083.html',
    thumbnail: 'thumbnail/class-1083.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1084',
    title: 'Duke Dashington Remastered',
    description: 'Duke Dashington Remastered - Classroom6x unblocked game',
    url: 'Classroom6x/class-1084.html',
    thumbnail: 'thumbnail/class-1084.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1085',
    title: 'Dirk Valentine',
    description: 'Dirk Valentine - Classroom6x unblocked game',
    url: 'Classroom6x/class-1085.html',
    thumbnail: 'thumbnail/class-1085.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1086',
    title: 'Test Subject Arena',
    description: 'Test Subject Arena - Classroom6x unblocked game',
    url: 'Classroom6x/class-1086.html',
    thumbnail: 'thumbnail/class-1086.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-1087',
    title: 'Dark Boy',
    description: 'Dark Boy - Classroom6x unblocked game',
    url: 'Classroom6x/class-1087.html',
    thumbnail: 'thumbnail/class-1087.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1088',
    title: 'Cactu Sama',
    description: 'Cactu Sama - Classroom6x unblocked game',
    url: 'Classroom6x/class-1088.html',
    thumbnail: 'thumbnail/class-1088.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-1089',
    title: 'Temple Glider',
    description: 'Temple Glider - Classroom6x unblocked game',
    url: 'Classroom6x/class-1089.html',
    thumbnail: 'thumbnail/class-1089.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1090',
    title: 'Tap Tricks',
    description: 'Tap Tricks - Classroom6x unblocked game',
    url: 'Classroom6x/class-1090.html',
    thumbnail: 'thumbnail/class-1090.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-1091',
    title: 'Lava Land',
    description: 'Lava Land - Classroom6x unblocked game',
    url: 'Classroom6x/class-1091.html',
    thumbnail: 'thumbnail/class-1091.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1092',
    title: 'Sniper Code 2',
    description: 'Sniper Code 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1092.html',
    thumbnail: 'thumbnail/class-1092.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-1093',
    title: 'Spectrum',
    description: 'Spectrum - Classroom6x unblocked game',
    url: 'Classroom6x/class-1093.html',
    thumbnail: 'thumbnail/class-1093.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-1094',
    title: 'Sides Of Gravity',
    description: 'Sides Of Gravity - Classroom6x unblocked game',
    url: 'Classroom6x/class-1094.html',
    thumbnail: 'thumbnail/class-1094.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-1095',
    title: 'Grapple Grip',
    description: 'Grapple Grip - Classroom6x unblocked game',
    url: 'Classroom6x/class-1095.html',
    thumbnail: 'thumbnail/class-1095.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-1096',
    title: 'Jumping Clones',
    description: 'Jumping Clones - Classroom6x unblocked game',
    url: 'Classroom6x/class-1096.html',
    thumbnail: 'thumbnail/class-1096.png',
    category: 'Platform'
  },
  {
    id: 'classroom6x-1097',
    title: 'Tiles Master',
    description: 'Tiles Master - Classroom6x unblocked game',
    url: 'Classroom6x/class-1097.html',
    thumbnail: 'thumbnail/class-1097.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1098',
    title: 'Jigsaw Gems',
    description: 'Jigsaw Gems - Classroom6x unblocked game',
    url: 'Classroom6x/class-1098.html',
    thumbnail: 'thumbnail/class-1098.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1099',
    title: 'Laser Quest',
    description: 'Laser Quest - Classroom6x unblocked game',
    url: 'Classroom6x/class-1099.html',
    thumbnail: 'thumbnail/class-1099.png',
    category: '3D'
  },
  {
    id: 'classroom6x-1100',
    title: 'Laser Maze Puzzle',
    description: 'Laser Maze Puzzle - Classroom6x unblocked game',
    url: 'Classroom6x/class-1100.html',
    thumbnail: 'thumbnail/class-1100.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1101',
    title: 'Line Connect',
    description: 'Line Connect - Classroom6x unblocked game',
    url: 'Classroom6x/class-1101.html',
    thumbnail: 'thumbnail/class-1101.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1102',
    title: 'Paper Block',
    description: 'Paper Block - Classroom6x unblocked game',
    url: 'Classroom6x/class-1102.html',
    thumbnail: 'thumbnail/class-1102.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1103',
    title: 'Satisbox',
    description: 'Satisbox - Classroom6x unblocked game',
    url: 'Classroom6x/class-1103.html',
    thumbnail: 'thumbnail/class-1103.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1104',
    title: 'Word Slide',
    description: 'Word Slide - Classroom6x unblocked game',
    url: 'Classroom6x/class-1104.html',
    thumbnail: 'thumbnail/class-1104.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1105',
    title: 'Woody Sort',
    description: 'Woody Sort - Classroom6x unblocked game',
    url: 'Classroom6x/class-1105.html',
    thumbnail: 'thumbnail/class-1105.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1106',
    title: 'Castle Woodwarf',
    description: 'Castle Woodwarf - Classroom6x unblocked game',
    url: 'Classroom6x/class-1106.html',
    thumbnail: 'thumbnail/class-1106.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1107',
    title: 'Slashz',
    description: 'Slashz - Classroom6x unblocked game',
    url: 'Classroom6x/class-1107.html',
    thumbnail: 'thumbnail/class-1107.png',
    category: '3D'
  },
  {
    id: 'classroom6x-1108',
    title: 'Numbskull',
    description: 'Numbskull - Classroom6x unblocked game',
    url: 'Classroom6x/class-1108.html',
    thumbnail: 'thumbnail/class-1108.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1109',
    title: 'Rubble Trouble',
    description: 'Rubble Trouble - Classroom6x unblocked game',
    url: 'Classroom6x/class-1109.html',
    thumbnail: 'thumbnail/class-1109.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1110',
    title: 'Shapes',
    description: 'Shapes - Classroom6x unblocked game',
    url: 'Classroom6x/class-1110.html',
    thumbnail: 'thumbnail/class-1110.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1111',
    title: 'Match Bee',
    description: 'Match Bee - Classroom6x unblocked game',
    url: 'Classroom6x/class-1111.html',
    thumbnail: 'thumbnail/class-1111.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1112',
    title: 'Forgotten Hill Disillusion Florafauna',
    description: 'Forgotten Hill Disillusion Florafauna - Classroom6x unblocked game',
    url: 'Classroom6x/class-1112.html',
    thumbnail: 'thumbnail/class-1112.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1113',
    title: 'Forgotten Hill Memento Buried Things',
    description: 'Forgotten Hill Memento Buried Things - Classroom6x unblocked game',
    url: 'Classroom6x/class-1113.html',
    thumbnail: 'thumbnail/class-1113.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1114',
    title: 'Forgotten Hill Puppeteer Html5',
    description: 'Forgotten Hill Puppeteer Html5 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1114.html',
    thumbnail: 'thumbnail/class-1114.png',
    category: 'Puzzle'
  },
  {
    id: 'classroom6x-1115',
    title: 'Little Cabin In The Woods',
    description: 'Little Cabin In The Woods - Classroom6x unblocked game',
    url: 'Classroom6x/class-1115.html',
    thumbnail: 'thumbnail/class-1115.png',
    category: 'Adventure'
  },
  {
    id: 'classroom6x-1116',
    title: 'Babel Tower',
    description: 'Babel Tower - Classroom6x unblocked game',
    url: 'Classroom6x/class-1116.html',
    thumbnail: 'thumbnail/class-1116.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1117',
    title: 'Papas Bakeria',
    description: 'Papas Bakeria - Classroom6x unblocked game',
    url: 'Classroom6x/class-1117.html',
    thumbnail: 'thumbnail/class-1117.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1118',
    title: 'Papas Cupcakeria',
    description: 'Papas Cupcakeria - Classroom6x unblocked game',
    url: 'Classroom6x/class-1118.html',
    thumbnail: 'thumbnail/class-1118.png',
    category: 'Management'
  },
  {
    id: 'classroom6x-1119',
    title: 'Castle Defender Saga',
    description: 'Castle Defender Saga - Classroom6x unblocked game',
    url: 'Classroom6x/class-1119.html',
    thumbnail: 'thumbnail/class-1119.png',
    category: 'Action'
  },
  {
    id: 'classroom6x-1120',
    title: 'Supergun',
    description: 'Supergun - Classroom6x unblocked game',
    url: 'Classroom6x/class-1120.html',
    thumbnail: 'thumbnail/class-1120.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-1121',
    title: 'Circuroid',
    description: 'Circuroid - Classroom6x unblocked game',
    url: 'Classroom6x/class-1121.html',
    thumbnail: 'thumbnail/class-1121.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-1122',
    title: 'Koala Bros Bash',
    description: 'Koala Bros Bash - Classroom6x unblocked game',
    url: 'Classroom6x/class-1122.html',
    thumbnail: 'thumbnail/class-1122.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1123',
    title: 'Picnic Penguin',
    description: 'Picnic Penguin - Classroom6x unblocked game',
    url: 'Classroom6x/class-1123.html',
    thumbnail: 'thumbnail/class-1123.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1124',
    title: 'Doctor Acorn 2',
    description: 'Doctor Acorn 2 - Classroom6x unblocked game',
    url: 'Classroom6x/class-1124.html',
    thumbnail: 'thumbnail/class-1124.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1125',
    title: 'Silly Sausage',
    description: 'Silly Sausage - Classroom6x unblocked game',
    url: 'Classroom6x/class-1125.html',
    thumbnail: 'thumbnail/class-1125.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1126',
    title: 'Whack Em All',
    description: 'Whack Em All - Classroom6x unblocked game',
    url: 'Classroom6x/class-1126.html',
    thumbnail: 'thumbnail/class-1126.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1127',
    title: 'Rock Paper Clicker',
    description: 'Rock Paper Clicker - Classroom6x unblocked game',
    url: 'Classroom6x/class-1127.html',
    thumbnail: 'thumbnail/class-1127.png',
    category: 'Skill'
  },
  {
    id: 'classroom6x-1128',
    title: 'Pogo Penguin',
    description: 'Pogo Penguin - Classroom6x unblocked game',
    url: 'Classroom6x/class-1128.html',
    thumbnail: 'thumbnail/class-1128.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1129',
    title: 'Pet Party Columns',
    description: 'Pet Party Columns - Classroom6x unblocked game',
    url: 'Classroom6x/class-1129.html',
    thumbnail: 'thumbnail/class-1129.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1130',
    title: 'Frostwing',
    description: 'Frostwing - Classroom6x unblocked game',
    url: 'Classroom6x/class-1130.html',
    thumbnail: 'thumbnail/class-1130.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1131',
    title: 'Fatcat',
    description: 'Fatcat - Classroom6x unblocked game',
    url: 'Classroom6x/class-1131.html',
    thumbnail: 'thumbnail/class-1131.png',
    category: 'Animal'
  },
  {
    id: 'classroom6x-1132',
    title: 'Udder',
    description: 'Udder - Classroom6x unblocked game',
    url: 'Classroom6x/class-1132.html',
    thumbnail: 'thumbnail/class-1132.png',
    category: 'Action'
  },
];

// Combine the existing curated catalog with the Slope-3 Classroom6x catalog,
// then guarantee every entry has a stable unique id (used for keys & favorites).
const games = [...gamesData, ...slopeClassroomGames].map((game, index) => {
  if (!game.id) {
    const slug = (game.title || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return {
      ...game,
      id: `game-gen-${index}-${slug}`
    };
  }
  return game;
});
import { initialArticles, gameOptions, toneOptions, generateMockAIArticle } from './data/articles';
import FlashcardsWorkspace from './components/FlashcardsWorkspace';
import QuizWorkspace from './components/QuizWorkspace';
import GrammarCheckerWorkspace from './components/GrammarCheckerWorkspace';
import ChatWorkspace from './components/ChatWorkspace';
import MoviesWorkspace from './components/MoviesWorkspace';
import InformationSection from './components/InformationSection';
import { 
  School, 
  Search, 
  Play,
  Info, 
  ExternalLink, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Plus, 
  Minus, 
  Heart, 
  ShieldAlert, 
  Gamepad2, 
  Users, 
  Layers,
  Sparkles,
  ArrowLeft,
  Volume2,
  Tv,
  MessageSquare,
  Globe,
  Dribbble,
  BookOpen,
  Github,
  Compass,
  FileText,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  LogOut,
  Copy,
  Code,
  Share2,
  Download,
  Upload,
  Settings,
  Check,
  X,
  Shuffle,
  Cpu,
  Box,
  Mail
} from 'lucide-react';

// Safe storage helper to prevent SecurityError crash in sandboxed iframes
const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // Ignore security errors
    }
  }
};

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = safeStorage.getItem('unblocked-theme');
    return saved && ['cyborg', 'violet', 'ice', 'rose-pine', 'none'].includes(saved) ? saved : 'none';
  });
  const [mode, setMode] = useState(() => {
    const savedMode = safeStorage.getItem('unblocked-mode');
    if (savedMode) return savedMode;
    const initialViewMode = safeStorage.getItem('classroom-view-mode') || 'articles';
    return initialViewMode === 'games' ? 'dark' : 'light';
  });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [activePortal, setActivePortal] = useState(null);

  // List of Browse Portals subsection items. Each opens /category/{slug}.html in an iframe.
  const portalList = [
    { slug: '2-player', label: '2 Player' },
    { slug: '3d', label: '3D' },
    { slug: 'action', label: 'Action' },
    { slug: 'adventure', label: 'Adventure' },
    { slug: 'animal', label: 'Animal' },
    { slug: 'board', label: 'Board' },
    { slug: 'car', label: 'Car' },
    { slug: 'fighting', label: 'Fighting' },
    { slug: 'girls', label: 'Girls' },
    { slug: 'idle', label: 'Idle' },
    { slug: 'management', label: 'Management' },
    { slug: 'moto', label: 'Moto' },
    { slug: 'multiplayer', label: 'Multiplayer' },
    { slug: 'new', label: 'New' },
    { slug: 'platform', label: 'Platform' },
    { slug: 'popular', label: 'Popular' },
    { slug: 'puzzle', label: 'Puzzle' },
    { slug: 'racing', label: 'Racing' },
    { slug: 'running', label: 'Running' },
    { slug: 'shooting', label: 'Shooting' },
    { slug: 'simulation', label: 'Simulation' },
    { slug: 'skill', label: 'Skill' },
    { slug: 'sports', label: 'Sports' },
    { slug: 'stickman', label: 'Stickman' },
    { slug: 'strategy', label: 'Strategy' },
    { slug: 'survival', label: 'Survival' },
  ];

  // Handle game selection from embedded Classroom6x iframe
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'play-game') {
        setSelectedGame({
          id: `classroom6x-${e.data.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          title: e.data.title,
          url: e.data.url,
          description: 'Classroom6x Unblocked Game',
          thumbnail: e.data.thumbnail || '',
          category: 'Classroom6x'
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const [zoom, setZoom] = useState(1);
  const [failedThumbnails, setFailedThumbnails] = useState({});
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = safeStorage.getItem('unblocked-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [viewMode, setViewMode] = useState(() => {
    const saved = safeStorage.getItem('classroom-view-mode');
    if (saved === 'games') return 'games';
    return 'articles'; // Innocent educational syllabus base is shown on first startup
  });

  const isPasscodeUnlocked = viewMode === 'games';

  const setViewModeAndSave = (mode) => {
    setViewMode(mode);
    safeStorage.setItem('classroom-view-mode', mode);
    safeStorage.setItem('classroom-passcode-unlocked', mode === 'games' ? 'true' : 'false');
  };

  const [passcode, setPasscode] = useState('');
  const [isShake, setIsShake] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);

  // Articles and Custom AI article generator states
  const [activeEduTab, setActiveEduTab] = useState('articles'); // 'articles' | 'flashcards' | 'grammar' | 'quiz'
  const [articles, setArticles] = useState(initialArticles);
  const [selectedArticleId, setSelectedArticleId] = useState(initialArticles[0].id);
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedArticleCategory, setSelectedArticleCategory] = useState('All');
  const [newArticleGame, setNewArticleGame] = useState(gameOptions[0].value);
  const [newArticleTone, setNewArticleTone] = useState(toneOptions[0].value);
  const [customPromptText, setCustomPromptText] = useState(`Write an educational, informational article focusing on ${gameOptions[0].value} concepts suited for school reading.`);
  const [isPromptUserModified, setIsPromptUserModified] = useState(false);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Classroom/Games Cloak/Decoy State
  const [decoyType, setDecoyType] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlDecoyType = params.get('decoyType');
      if (urlDecoyType && ['none', 'classroom', 'clever', 'campus', 'docs', 'gmail'].includes(urlDecoyType)) {
        return urlDecoyType;
      }
      const urlDecoy = params.get('decoy');
      if (urlDecoy === 'true') return 'classroom';
      if (urlDecoy === 'false') return 'none';
      if (urlDecoy && ['none', 'classroom', 'clever', 'campus', 'docs', 'gmail'].includes(urlDecoy)) {
        return urlDecoy;
      }
      const cached = localStorage.getItem('study-tools-decoy-type');
      if (cached && ['none', 'classroom', 'clever', 'campus', 'docs', 'gmail'].includes(cached)) {
        return cached;
      }
      const cachedLegacy = localStorage.getItem('study-tools-classroom-decoy');
      if (cachedLegacy === 'true') return 'classroom';
    }
    return 'none';
  });

  const useClassroomDecoy = decoyType !== 'none';

  const [aboutBlankSuffix, setAboutBlankSuffix] = useState('');

  // Persist decoy state to localStorage
  useEffect(() => {
    localStorage.setItem('study-tools-decoy-type', decoyType);
    localStorage.setItem('study-tools-classroom-decoy', String(decoyType !== 'none'));
  }, [decoyType]);

  // Set white as the main starting color for articles (light mode), and black for games (dark mode)
  useEffect(() => {
    if (viewMode === 'articles') {
      setMode('light');
    } else if (viewMode === 'games') {
      setMode('dark');
    }
  }, [viewMode]);

  const handleGenerateArticle = () => {
    if (isGeneratingArticle) return;
    setIsGeneratingArticle(true);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const article = generateMockAIArticle(newArticleGame, newArticleTone, customPromptText);
            setArticles((prevArticles) => [article, ...prevArticles]);
            setSelectedArticleCategory(article.category);
            setSelectedArticleId(article.id);
            setIsGeneratingArticle(false);
          }, 200);
          return 100;
        }
        return prev + 5;
      });
    }, 45);
  };

  const handlePasswordSubmit = (customPass) => {
    const inputPass = (customPass !== undefined ? customPass : passcode).trim().toLowerCase();
    if (!inputPass) return;

    if (inputPass === 'ttt0609' || inputPass === '1378' || inputPass === '') {
      setTimeout(() => {
        setViewModeAndSave('games');
        setPasscode('');
      }, 150);
    } else if (inputPass === '0609') {
      setTimeout(() => {
        setViewModeAndSave('articles');
        setPasscode('');
      }, 150);
    } else if (
      inputPass === '1212' || 
      inputPass === '1111' || 
      ['school', 'classroom', 'study', 'science', 'math', 'education', 'admin', 'password', 'open', 'class'].includes(inputPass)
    ) {
      setTimeout(() => {
        setViewModeAndSave('articles');
        setPasscode('');
      }, 150);
    } else {
      setTimeout(() => {
        setIsShake(true);
        setErrorCount(prev => prev + 1);
        setTimeout(() => {
          setIsShake(false);
          setPasscode('');
        }, 500);
      }, 100);
    }
  };

  const handleDigitInput = (digit) => {
    if (viewMode === 'games') return;
    const nextPasscode = passcode + digit;
    setPasscode(nextPasscode);

    // Instant matching for rapid-pins (2026, 0609, 1212, 1111)
    if (nextPasscode === '2026') {
      setTimeout(() => {
        setViewModeAndSave('games');
        setPasscode('');
      }, 150);
    } else if (nextPasscode === '0609' || nextPasscode === '1212' || nextPasscode === '1111') {
      setTimeout(() => {
        setViewModeAndSave('articles');
        setPasscode('');
      }, 150);
    } else if (nextPasscode.length >= 4 && !isNaN(nextPasscode)) {
      setTimeout(() => {
        setIsShake(true);
        setErrorCount(prev => prev + 1);
        setTimeout(() => {
          setIsShake(false);
          setPasscode('');
        }, 500);
      }, 200);
    }
  };

  useEffect(() => {
    if (viewMode !== 'locked') return;
    
    const handleKeyDown = (e) => {
      // If focused inside the text input, let native browser behavior take over. Only intercept Enter/Escape.
      if (document.activeElement?.tagName === 'INPUT') {
        if (e.key === 'Escape') {
          setPasscode('');
        }
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleDigitInput(e.key);
      } else if (e.key === 'Backspace') {
        setPasscode(prev => prev.slice(0, -1));
      } else if (e.key === 'Escape') {
        setPasscode('');
      } else if (e.key === 'Enter') {
        handlePasswordSubmit();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [passcode, viewMode]);

  // Automated trigger checks for "0609" and "2026" within the article system's search tab
  useEffect(() => {
    if (articleSearch === '2026' || articleSearch.toLowerCase() === 'ttt0609') {
      setViewModeAndSave('games');
      setArticleSearch('');
    } else if (articleSearch === '0609') {
      setViewModeAndSave('locked');
      setArticleSearch('');
    }
  }, [articleSearch]);

  // Global keydown listeners for quick keystroke combinations
  useEffect(() => {
    let sequenceBuffer = '';
    const handleGlobalSequence = (e) => {
      // Avoid intercepting if targeted on search input to let them type fully
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key >= '0' && e.key <= '9') {
        sequenceBuffer += e.key;
        if (sequenceBuffer.length > 4) {
          sequenceBuffer = sequenceBuffer.slice(-4);
        }
        
        if (sequenceBuffer === '0609') {
          setViewModeAndSave('locked');
          setPasscode('');
          sequenceBuffer = '';
        } else if (sequenceBuffer === '2026') {
          setViewModeAndSave('games');
          setPasscode('');
          sequenceBuffer = '';
        }
      } else if (e.key === 'Escape') {
        sequenceBuffer = '';
      }
    };
    window.addEventListener('keydown', handleGlobalSequence);
    return () => window.removeEventListener('keydown', handleGlobalSequence);
  }, [viewMode]);

  // Global Panic Key Handler
  useEffect(() => {
    const handlePanic = (e) => {
      if (e.key === '[' || e.key === ']') {
        e.preventDefault();
        setViewModeAndSave('articles');
        setSelectedGame(null); // Instantly close active game to clear screen
      }
    };
    window.addEventListener('keydown', handlePanic);
    return () => window.removeEventListener('keydown', handlePanic);
  }, []);

  // Set dynamic browser tab title & favicon based on current section & decoy toggle
  useEffect(() => {
    const setBothTitles = (title) => {
      document.title = title;
      try {
        if (window.parent && window.parent !== window && window.parent.document) {
          window.parent.document.title = title;
        }
      } catch (err) {
        // ignore cross-origin sandbox restrictions
      }
    };

    const updateFavicon = (href) => {
      const applyIcon = (doc, iconUrl) => {
        // Remove ALL existing favicon links to avoid browser caching or conflict issues
        const existingLinks = doc.querySelectorAll("link[rel*='icon']");
        existingLinks.forEach(link => {
          if (link.parentNode) {
            link.parentNode.removeChild(link);
          }
        });

        // Determine correct mime-type
let typeVal = 'image/png';
if (iconUrl.includes('.ico')) {
  typeVal = 'image/x-icon';
} else if (iconUrl.includes('.webp')) {
  typeVal = 'image/webp';
} else if (iconUrl.includes('image/svg+xml') || iconUrl.startsWith('data:image/svg+xml')) {
  typeVal = 'image/svg+xml';
}

        // Add standard icon element
        const newLink = doc.createElement('link');
        newLink.rel = 'icon';
        newLink.type = typeVal;
        newLink.href = iconUrl;
        doc.head.appendChild(newLink);

        // Add shortcut icon element for maximum compatibility
        const shortcutLink = doc.createElement('link');
        shortcutLink.rel = 'shortcut icon';
        shortcutLink.type = typeVal;
        shortcutLink.href = iconUrl;
        doc.head.appendChild(shortcutLink);
      };

      // Current document
      applyIcon(document, href);

      // Parent document
      try {
        if (window.parent && window.parent !== window && window.parent.document) {
          applyIcon(window.parent.document, href);
        }
      } catch (err) {
        // ignore cross-origin sandbox restrictions
      }
    };

    const bookSvgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h15M6 10h15"/></svg>`
    )}`;

    if (viewMode === 'articles') {
      setBothTitles("StudyTools");
      updateFavicon(bookSvgDataUri);
    } else if (viewMode === 'games') {
      if (decoyType === 'classroom') {
        setBothTitles("Home - Classroom");
        updateFavicon("https://ssl.gstatic.com/classroom/favicon.png");
      } else if (decoyType === 'clever') {
        setBothTitles("Clever | Log in with Clever");
        updateFavicon("https://www.google.com/s2/favicons?sz=64&domain=clever.com");
      } else if (decoyType === 'campus') {
        setBothTitles("Campus Student");
        updateFavicon("https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png");
      } else if (decoyType === 'docs') {
        setBothTitles("Google Docs");
        updateFavicon("https://ssl.gstatic.com/docs/documents/images/docs-favicon-2026-v2.ico");
      } else if (decoyType === 'gmail') {
        setBothTitles("Inbox - Jersey City Public Schools");
        updateFavicon("https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_gmail_2026_v2.ico");
      } else {
        setBothTitles("StudyTools");
        updateFavicon(bookSvgDataUri);
      }
    } else {
      // Default to StudyTools for locked/welcome screens
      setBothTitles("StudyTools");
      updateFavicon(bookSvgDataUri);
    }
  }, [viewMode, decoyType]);

  // Sync custom prompt text with dropdown selections if not manually customized
  useEffect(() => {
    if (!isPromptUserModified) {
      setCustomPromptText(`Write an educational, ${newArticleTone.toLowerCase()} article focusing on ${newArticleGame} concepts suited for school reading.`);
    }
  }, [newArticleGame, newArticleTone, isPromptUserModified]);

  // Set LocalStorage theme and mode on change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', mode);
    safeStorage.setItem('unblocked-theme', theme);
    safeStorage.setItem('unblocked-mode', mode);
  }, [theme, mode]);

  // Set LocalStorage favorites on change
  useEffect(() => {
    safeStorage.setItem('unblocked-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Hide/show chat widget based on lock state
  useEffect(() => {
    document.body.setAttribute('data-locked', isPasscodeUnlocked ? 'false' : 'true');
  }, [isPasscodeUnlocked]);



  // Handle addition/removal of favorites
  const toggleFavorite = (e, gameId) => {
    e.stopPropagation();
    if (favorites.includes(gameId)) {
      setFavorites(favorites.filter(id => id !== gameId));
    } else {
      setFavorites([...favorites, gameId]);
    }
  };

  // Helper method to draw beautiful game art based on game title / id
  const renderGameArt = (game) => {
    const iconSize = 48;
    switch (game.id) {
      case 1: // Slope
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Grid background effect */}
            <div className="absolute inset-0 opacity-15 overflow-hidden">
              <div className="w-full h-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]" />
              <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/30 to-transparent" />
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-emerald-500/20 blur-md animate-pulse" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] transform hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="absolute bottom-3 w-1/2 h-[3px] bg-emerald-400/50 rounded transform rotate-12" />
          </div>
        );
      case 2: // 2048
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1 bg-amber-950/20 p-2 rounded">
              <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-xs font-black text-black">2</div>
              <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center text-xs font-black text-white">0</div>
              <div className="w-8 h-8 rounded bg-yellow-500 flex items-center justify-center text-xs font-black text-white">4</div>
              <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center text-xs font-black text-white animate-bounce">8</div>
            </div>
          </div>
        );
      case 3: // Retro Bowl
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-blue-400 opacity-60">QUARTERBACK</div>
            <div className="relative w-14 h-8 bg-amber-800 rounded-full border-y-[3px] border-white/60 flex items-center justify-center shadow-lg transform -rotate-12">
              <div className="w-1 h-6 bg-white/80 absolute" />
              <div className="w-3 h-[2px] bg-white translate-x-2 absolute" />
              <div className="w-3 h-[2px] bg-white -translate-x-2 absolute" />
            </div>
          </div>
        );
      case 4: // Flappy Bird
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-y-0 right-6 w-5 h-full flex flex-col justify-between py-2">
              <div className="w-full h-8 bg-green-500 rounded-b border-2 border-white/40" />
              <div className="w-full h-12 bg-green-500 rounded-t border-2 border-white/40" />
            </div>
            <div className="relative w-10 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-md animate-bounce">
              <div className="absolute right-1 w-3 h-3 bg-white rounded-full border border-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              <div className="absolute left-1 w-3 h-2 bg-orange-500 rounded-lg" />
              <div className="absolute bottom-1 w-4 h-2 bg-white/80 rounded-full border border-black/40 rotate-12" />
            </div>
          </div>
        );
      case 5: // Pacman Retro
        return (
          <div className="relative w-full h-full flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-full border-r-4 border-transparent rotate-45 animate-pulse" />
            <div className="w-2 h-2 bg-white rounded-full" />
            <div className="w-2 h-2 bg-white/60 rounded-full" />
            <div className="w-2 h-2 bg-white/30 rounded-full" />
          </div>
        );
      case 6: // Tunnel rush
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="absolute w-24 h-24 border-2 border-dashed border-purple-500/40 rounded-full animate-spin" />
            <div className="absolute w-16 h-16 border border-purple-500/30 rounded-full animate-ping" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white" />
          </div>
        );
      case 7: // Chess
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]">
            <div className="border border-white/20 p-1 bg-black/40 rounded flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                <div className="w-4 h-4 bg-white" />
                <div className="w-4 h-4 bg-stone-700" />
              </div>
              <div className="flex gap-0.5">
                <div className="w-4 h-4 bg-stone-700" />
                <div className="w-4 h-4 bg-white" />
              </div>
            </div>
            <div className="absolute text-2xl font-semibold transform hover:scale-110 duration-200">♟️</div>
          </div>
        );
      case 8: // Bubble shooter
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute top-3 flex gap-2">
              <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]" />
              <div className="w-4 h-4 bg-red-400 rounded-full shadow-[0_0_8px_red]" />
              <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_8px_yellow]" />
            </div>
            <div className="absolute bottom-2 w-2 h-8 bg-zinc-400 rounded-full origin-bottom rotate-45 animate-pulse" />
          </div>
        );
      case 9: // Crossy Road
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-x-0 h-4 bg-neutral-800/80 border-y border-neutral-700" />
            <div className="w-8 h-8 bg-white border border-neutral-300 rounded flex flex-col items-center justify-center transform hover:translate-y-[-6px] transition-transform shadow-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1" />
              <div className="w-3 h-1.5 bg-yellow-500 rounded-b mt-0.5" />
            </div>
          </div>
        );
      case 10: // Solitaire
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-9 h-14 bg-white border border-neutral-200 rounded-md shadow-md flex flex-col justify-between p-1 text-red-600 transform hover:-translate-y-2 hover:rotate-6 duration-300">
              <span className="text-[9px] font-black leading-none">A</span>
              <span className="text-sm self-center">♥️</span>
              <span className="text-[9px] font-black leading-none self-end scale-y-[-1]">A</span>
            </div>
            <div className="absolute w-9 h-14 bg-red-600 border border-white rounded-md shadow-md flex flex-col justify-between p-1 text-white -translate-x-3 translate-y-1 transform hover:rotate-12 duration-300">
              <div className="w-full h-full border border-white/20 rounded flex items-center justify-center text-xs">✨</div>
            </div>
          </div>
        );
      case 11: // Doodle jump
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-8 h-1.5 bg-green-500 rounded bottom-6" />
            <div className="w-8 h-10 bg-lime-400 rounded-t-full border border-green-600 flex flex-col items-center relative animate-bounce shadow">
              <div className="w-4 h-1.5 bg-lime-500 rounded absolute -bottom-1" />
              <div className="flex gap-1 mt-2">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              <div className="w-1.5 h-4 bg-lime-600 rounded-full mt-1" />
            </div>
          </div>
        );
      case 12: // Classroom portal
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="bg-sky-500/10 p-3 rounded-full border border-sky-400/20">
              <MessageSquare className="text-sky-400 w-10 h-10 animate-pulse" />
            </div>
          </div>
        );
      case 13: // Youtube stealth
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-14 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg relative cursor-pointer transform hover:scale-105 duration-200">
              <Play className="fill-white text-white w-5 h-5 ml-0.5" />
            </div>
          </div>
        );
      case 14: // Stealth proxy frame
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="bg-zinc-800 p-3 rounded-lg border-2 border-zinc-700 flex flex-col items-center gap-1 shadow-md">
              <Globe className="text-zinc-300 w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
        );
      case 15: // Sim Life
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="bg-pink-500/10 p-4 rounded-full border border-pink-400/30">
              <Users className="text-pink-400 w-8 h-8 hover:rotate-12 duration-200" />
            </div>
          </div>
        );
      case 16: // Sandbox Island
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-amber-950 opacity-40" />
            <div className="relative w-12 h-12 bg-amber-800 rounded-md border-t-[8px] border-emerald-500 shadow-xl flex items-center justify-center font-mono font-bold text-white/50 text-[10px]">
              3D
            </div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <Gamepad2 className="text-neutral-400 w-12 h-12" />
          </div>
        );
    }
  };

  const isSinglePlayerCategory = (cat) => {
    if (!cat) return true;
    const c = cat.toLowerCase().trim();
    if (c === 'minecraft' || c === 'emulated' || c === 'other websites') return true;
    return ['solo', 'single', 'platformer', 'skill', 'science', 'driving', 'horror', 'creative', 'ai'].some(kw => c.includes(kw));
  };

  const isMultiplayerCategory = (cat) => {
    if (!cat) return false;
    const c = cat.toLowerCase().trim();
    if (c === 'minecraft' || c === 'random' || c === 'other websites') return true;
    return ['social', 'sport', 'multiplayer', 'fast', 'party', 'puzzle', 'shooter'].some(kw => c.includes(kw)) || c.includes('or');
  };

  // Filter games based on category sidebar, matching search query
  const filteredGames = games.filter(game => {
    if (filter === 'single') {
      if (!isSinglePlayerCategory(game.category)) return false;
    } else if (filter === 'multiplayer') {
      if (!isMultiplayerCategory(game.category)) return false;
    } else if (filter === 'favorites') {
      if (!favorites.includes(game.id)) return false;
    } else if (filter !== 'all') {
      // Direct category filter matching
      if ((game.category || '').toLowerCase().trim() !== filter.toLowerCase().trim()) return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = (game.title || '').toLowerCase().includes(q);
      const matchDesc = (game.description || '').toLowerCase().includes(q);
      const matchCat = (game.category || '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCat;
    }

    return true;
  });



  if (!isPasscodeUnlocked) {
    const filteredArticles = articles.filter(art => {
      const matchesCategory = selectedArticleCategory === 'All' || art.category === selectedArticleCategory;
      if (!matchesCategory) return false;

      const q = articleSearch.toLowerCase().trim();
      if (!q) return true;
      return art.title.toLowerCase().includes(q) || 
             art.content.toLowerCase().includes(q) || 
             art.category.toLowerCase().includes(q);
    });

    const selectedArticle = filteredArticles.find(art => art.id === selectedArticleId) || filteredArticles[0] || articles[0];

    const renderFormattedText = (text) => {
      if (!text) return null;
      
      const lines = text.split('\n');
      const elements = [];
      let i = 0;
      let elementKey = 0;
      
      // Inline formatting helper
      const parseInlineFormatting = (str) => {
        if (!str) return '';
        let cleaned = str
          // Chemical formulas subscripts
          .replace(/CO_2/g, 'CO₂')
          .replace(/H_2O/g, 'H₂O')
          .replace(/\\\text\{([^}]+)\}/g, '$1') // '\text{CO}' -> 'CO'
          .replace(/(\s*)\^(\w+)/g, '<sup>$2</sup>') // superscript like ^+ or ^-
          .replace(/(\s*)\_(\w+)/g, '<sub>$2</sub>') // subscript like _2
          .replace(/\\longrightarrow/g, ' ⟶ ')
          .replace(/\\rightarrow/g, ' → ')
          .replace(/\$\+\/\+\$/g, '➕/➕ (Mutualism)')
          .replace(/\$\+\/0\$/g, '➕/🫙 (Commensalism)')
          .replace(/\$\+\/\-\$/g, '➕/➖ (Parasitism)')
          .replace(/\$/g, ''); // strip any raw dollar signs
          
        // Let's parse bold **bold** and italic *italic* using react elements
        const parts = [];
        let index = 0;
        const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g;
        let match;
        
        while ((match = regex.exec(cleaned)) !== null) {
          if (match.index > index) {
            parts.push(cleaned.substring(index, match.index));
          }
          if (match[1]) {
            parts.push(<strong key={match.index} className="font-extrabold text-[var(--accent-color)]">{match[2]}</strong>);
          } else if (match[3]) {
            parts.push(<em key={match.index} className="italic text-[var(--text-primary)]">{match[4]}</em>);
          }
          index = regex.lastIndex;
        }
        
        if (index < cleaned.length) {
          parts.push(cleaned.substring(index));
        }
        
        return parts.length > 0 ? parts : cleaned;
      };
      
      const formatEquationToHtml = (eq) => {
        let formatted = eq.trim();
        
        if (formatted.includes('Atom')) {
          return (
            <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2.5 text-xs text-[var(--text-primary)] font-mono tracking-tight py-2 w-full">
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Atom</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Molecule</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Organelle</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Cell</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Tissue</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Organ</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Organ System</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-extrabold text-[var(--accent-color)] bg-[var(--accent-color)]/15 px-3 py-1 rounded-xl border border-[var(--accent-color)] shadow-sm animate-pulse">Organism</span>
            </div>
          );
        }
        
        if (formatted.includes('Photosynthesis') || (formatted.includes('6CO') && formatted.includes('Solar'))) {
          return (
            <div className="text-center font-bold text-xs flex flex-wrap items-center justify-center gap-1.5 leading-relaxed py-2 select-text w-full">
              <span className="text-[var(--text-primary)] font-semibold">Carbon Dioxide</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(6CO₂)</span>
              <span className="text-[var(--accent-color)] mx-0.5 font-mono">+</span>
              <span className="text-[var(--text-primary)] font-semibold">Water</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(6H₂O)</span>
              <span className="text-[var(--accent-color)] mx-0.5 font-mono">+</span>
              <span className="text-yellow-500 font-semibold flex items-center gap-0.5 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20 text-[10px]"><span className="animate-pulse">☀️</span> Solar Light</span>
              <span className="text-[var(--accent-color)] text-sm mx-1">⟶</span>
              <span className="text-[var(--text-primary)] font-semibold">Glucose</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(C₆H₁₂O₆)</span>
              <span className="text-[var(--accent-color)] mx-0.5 font-mono">+</span>
              <span className="text-[var(--text-primary)] font-semibold">Oxygen</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(6O₂)</span>
            </div>
          );
        }
        
        if (formatted.includes('Respiration') || formatted.includes('ATP') || (formatted.includes('6CO') && formatted.includes('Oxygen'))) {
          return (
            <div className="text-center font-bold text-xs flex flex-wrap items-center justify-center gap-1.5 leading-relaxed py-2 select-text w-full">
              <span className="text-[var(--text-primary)] font-semibold">Glucose</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(C₆H₁₂O₆)</span>
              <span className="text-[var(--accent-color)] mx-0.5 font-mono">+</span>
              <span className="text-[var(--text-primary)] font-semibold">Oxygen</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(6O₂)</span>
              <span className="text-[var(--accent-color)] text-sm mx-1">⟶</span>
              <span className="text-[var(--text-primary)] font-semibold">Carbon Dioxide</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(6CO₂)</span>
              <span className="text-[var(--accent-color)] mx-0.5 font-mono">+</span>
              <span className="text-[var(--text-primary)] font-semibold">Water</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(6H₂O)</span>
              <span className="text-[var(--accent-color)] mx-0.5 font-mono">+</span>
              <span className="text-emerald-500 font-bold flex items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px] animate-pulse">⚡ ATP Energy</span>
            </div>
          );
        }

        return <span>{formatted}</span>;
      };

      while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // 1. Equations (Centered math block)
        if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
          const content = trimmed.substring(2, trimmed.length - 2);
          elements.push(
            <div key={elementKey++} className="bg-[var(--bg-primary)] border border-[var(--accent-color)]/20 p-4 rounded-xl text-center my-4 shadow-sm text-[var(--accent-color)] flex items-center justify-center overflow-x-auto select-all">
              {formatEquationToHtml(content)}
            </div>
          );
          i++;
          continue;
        }
        
        // 2. Custom block code (e.g., Birthday card layout block)
        if (trimmed.startsWith('```') || trimmed.startsWith('`\\`\\`')) {
          let codeBlockLines = [];
          i++; // skip initial tag
          while (i < lines.length && !lines[i].trim().startsWith('```') && !lines[i].trim().startsWith('`\\`\\`')) {
            codeBlockLines.push(lines[i]);
            i++;
          }
          elements.push(
            <pre key={elementKey++} className="bg-black/40 border border-[var(--card-border)] p-4.5 rounded-xl text-[10.5px] font-mono text-[var(--text-primary)] whitespace-pre-wrap leading-normal shadow-inner my-3 select-all">
              {codeBlockLines.join('\n')}
            </pre>
          );
          i++; // skip final tag
          continue;
        }

        // 3. Simple blockquotes / horizontal separators
        if (trimmed.startsWith('---')) {
          elements.push(<hr key={elementKey++} className="border-t border-[var(--card-border)] my-5" />);
          i++;
          continue;
        }

        // 4. Tables parsing
        if (trimmed.startsWith('|')) {
          const headerRow = trimmed;
          let tableLines = [headerRow];
          i++;
          
          // Gather consecutive table rows
          while (i < lines.length && lines[i].trim().startsWith('|')) {
            tableLines.push(lines[i]);
            i++;
          }
          
          // Process Table Rows
          const filteredRows = tableLines.filter(r => !r.includes('| :---') && !r.includes('|---|') && !r.includes('| :--- |'));
          
          const parseColumns = (rowText) => {
            return rowText.split('|').slice(1, -1).map(col => col.trim());
          };

          if (filteredRows.length > 0) {
            const headers = parseColumns(filteredRows[0]);
            const bodyRows = filteredRows.slice(1).map(r => parseColumns(r));
            
            elements.push(
              <div key={elementKey++} className="my-4.5 overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--bg-primary)]/40 shadow-sm">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-[var(--bg-secondary)] border-b border-[var(--card-border)]">
                      {headers.map((h, hIdx) => (
                        <th key={hIdx} className="p-3.5 font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider text-[9px] border-r border-[var(--card-border)] last:border-r-0">
                          {parseInlineFormatting(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bodyRows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b last:border-b-0 border-[var(--card-border)] hover:bg-[var(--accent-color)]/5 transition-colors duration-150 odd:bg-black/[0.02] even:bg-transparent">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3 text-[var(--text-muted)] border-r border-[var(--card-border)] last:border-r-0 leading-relaxed font-sans font-medium">
                            {parseInlineFormatting(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          continue;
        }

        // 5. Headings (### H3)
        if (trimmed.startsWith('###')) {
          const hText = trimmed.replace(/^###\s*/, '');
          elements.push(
            <h4 key={elementKey++} className="text-xs font-bold font-mono tracking-tight text-[var(--text-primary)] border-l-2 border-[var(--accent-color)] pl-2.5 mt-5 mb-2 flex items-center gap-1.5 uppercase">
              {parseInlineFormatting(hText)}
            </h4>
          );
          i++;
          continue;
        }

        // 6. Bold Headers inside content e.g. "#### Header" or "**Header:**" or "Header:" followed by line bullet tags
        if (trimmed.startsWith('####')) {
          const hText = trimmed.replace(/^####\s*/, '');
          elements.push(
            <h5 key={elementKey++} className="text-[11px] font-extrabold font-mono tracking-tight text-[var(--text-primary)] mt-3 mb-1 text-[var(--accent-color)]">
              {parseInlineFormatting(hText)}
            </h5>
          );
          i++;
          continue;
        }

        // 7. Standard Lists starting with '*' or '-' or '●'
        if (trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.startsWith('●') || trimmed.startsWith('○')) {
          let cleanItem = trimmed.replace(/^(\*|-|●|○)\s*/, '');
          // Identify if it's high indentation (sub-list)
          const isNested = line.startsWith('  ') || line.startsWith('\t') || trimmed.startsWith('○');
          elements.push(
            <div key={elementKey++} className={`flex items-start gap-2 text-[11px] text-[var(--text-muted)] leading-relaxed mb-1.5 ${isNested ? 'ml-6' : 'ml-2'}`}>
              <span className={`flex-shrink-0 text-[10px] mt-0.5 select-none ${isNested ? 'text-[var(--text-muted)]/50 font-mono' : 'text-[var(--accent-color)]'}`}>
                {isNested ? '○' : '◼'}
              </span>
              <span className="font-medium font-sans">{parseInlineFormatting(cleanItem)}</span>
            </div>
          );
          i++;
          continue;
        }

        // 8. Ordered Lists (e.g., 1. Item)
        if (trimmed.match(/^\d+\./)) {
          const itemNum = trimmed.match(/^(\d+)\./)[1];
          const cleanItem = trimmed.replace(/^\d+\.\s*/, '');
          elements.push(
            <div key={elementKey++} className="flex items-start gap-2.5 text-[11px] text-[var(--text-muted)] leading-relaxed ml-2 mb-1.5">
              <span className="font-mono text-[9px] font-bold text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-1.5 py-0.5 rounded border border-[var(--accent-color)]/20 flex-shrink-0 mt-0.5 min-w-[20px] text-center">
                {itemNum}
              </span>
              <span className="font-medium font-sans">{parseInlineFormatting(cleanItem)}</span>
            </div>
          );
          i++;
          continue;
        }

        // 9. Standard paragraphs
        if (trimmed === '') {
          elements.push(<div key={elementKey++} className="h-2" />);
        } else {
          elements.push(
            <p key={elementKey++} className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-3 font-medium font-sans">
              {parseInlineFormatting(trimmed)}
            </p>
          );
        }
        
        i++;
      }
      
      return <div className="space-y-1.5">{elements}</div>;
    };

    if (viewMode === 'articles') {
      return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col p-4 md:p-6 transition-colors duration-300 relative select-text">
          
          {/* Decoy Legitimate Educational Header */}
          <header className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center pb-4 mb-4 border-b border-[var(--card-border)] gap-4 select-none">
            <div 
              onClick={() => { setActiveEduTab('articles'); setArticleSearch(''); }}
              className="flex items-center gap-3 cursor-pointer active:scale-98 transition-transform self-stretch sm:self-auto"
              title="StudyTools Home"
            >
              <div className="p-2 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-xl shadow-[0_2px_8.5px_var(--accent-shadow)] border border-[var(--card-border)]">
                <BookOpen className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-[var(--text-primary)] sm:text-base">
                  StudyTools <span className="text-[9px] font-mono border border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--accent-color)] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Academic Base</span>
                </h1>
              </div>
            </div>

            {/* HIGHLY ACCESSIBLE PRIMARY TAB SWITCHER */}
            <div className="flex items-center gap-1 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-full p-1 shadow-sm select-none max-w-full overflow-x-auto scrollbar-none">
              {[
                { id: 'articles', label: 'Syllabus Articles', icon: BookOpen },
                { id: 'flashcards', label: 'Study Flashcards', icon: Layers },
                { id: 'quiz', label: 'Practice Quizzes', icon: Gamepad2 },
                { id: 'grammar', label: 'Grammar Scanner', icon: FileText }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isSelected = activeEduTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEduTab(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-[var(--accent-color)] text-[var(--bg-color)] font-bold shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span className="leading-none">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
              {/* Sign out link */}
              <button
                onClick={() => {
                  setViewModeAndSave('articles');
                  setPasscode('');
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-red-500/50 hover:bg-red-500/10 text-[var(--text-primary)] hover:text-red-500 transition-all duration-200 cursor-pointer shadow-sm group"
                title="Sign Out to Lock Screen"
              >
                <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Sign Out</span>
              </button>

              {/* Light/Dark Toggle */}
              <div className="flex items-center gap-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] py-1.5 px-2.5 rounded-full shadow-sm">
                <div 
                  onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
                  className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 transition-all duration-300"
                >
                  <div 
                    className={`w-5 h-5 rounded-full bg-[var(--accent-color)] transition-all flex items-center justify-center text-[10px] transform ${
                      mode === 'dark' ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  >
                    {mode === 'dark' ? '🌙' : '☀️'}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Actual Articles Hub Grid (Occupies full-screen width) */}
          <div className="w-full max-w-7xl mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 md:p-6 shadow-2xl transition-all flex flex-col gap-4 flex-1 md:h-[650px] overflow-hidden">
            
            {activeEduTab === 'articles' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0 overflow-hidden">
                {/* Left Column - Articles selection */}
                <div className="md:col-span-2 flex flex-col gap-3 overflow-hidden h-full">
                  
                  {/* Subject Specific Sections */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0 scrollbar-none select-none">
                    {['All', 'Science', 'Mathematics', 'ELA', 'Social Studies', 'Italian'].map((cat) => {
                      const isSelected = selectedArticleCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedArticleCategory(cat);
                            const firstInCat = articles.find(art => cat === 'All' || art.category === cat);
                            if (firstInCat) {
                              setSelectedArticleId(firstInCat.id);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono border font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-98 ${
                            isSelected
                              ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--text-muted)]/50 hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative flex-shrink-0">
                    <input
                      type="text"
                      placeholder="Search curriculum papers..."
                      value={articleSearch}
                      onChange={(e) => setArticleSearch(e.target.value)}
                      className="w-full text-xs rounded-xl py-1.5 pl-8 pr-3 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] placeholder:opacity-50 transition-all font-mono"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
                  </div>

                  {/* Feed list */}
                  <div className="flex-1 flex flex-col gap-2 overflow-y-auto py-0.5 scrollbar-thin">
                    {filteredArticles.length === 0 ? (
                      <div className="text-center py-4 text-xs text-[var(--text-muted)] font-mono select-none">
                        No matching resource files available
                      </div>
                    ) : (
                      filteredArticles.map((art) => {
                        const isSelected = art.id === selectedArticleId;
                        return (
                          <div
                            key={art.id}
                            onClick={() => setSelectedArticleId(art.id)}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-sm scale-[1.01]'
                                : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-muted)]/40'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-0.5 flex-wrap">
                              <span className="text-[8px] font-bold font-mono tracking-wider px-1.5 py-0.5 rounded bg-[var(--input-fill)] text-[var(--accent-color)] uppercase">
                                {art.category}
                              </span>
                              <span className="text-[8px] text-[var(--text-muted)] font-mono">
                                {art.readTime}
                              </span>
                            </div>
                            <h4 className="text-[11px] font-bold leading-snug text-[var(--text-primary)] line-clamp-1">
                              {art.title}
                            </h4>
                            <p className="text-[9px] text-[var(--text-muted)] mt-0.5 font-mono">
                              {art.date}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* CUSTOMIZABLE PROMPT GENERATOR CONTAINER WRAP */}
                  <div className="bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl p-3 flex-shrink-0 flex flex-col gap-2 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-xs font-bold text-[var(--text-primary)] font-mono">Interactive AI Writer</span>
                      </div>
                      
                      {isPromptUserModified && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setCustomPromptText(`Write an educational, informational article focusing on ${newArticleGame} concepts suited for school reading.`);
                            setIsPromptUserModified(false);
                          }}
                          className="text-[9px] font-mono text-[var(--accent-color)] hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-none p-0"
                        >
                          Reset preset
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-left">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Subject</label>
                        <select
                          value={newArticleGame}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewArticleGame(val);
                            if (!isPromptUserModified) {
                              setCustomPromptText(`Write an educational, informational article focusing on ${val} concepts suited for school reading.`);
                            }
                          }}
                          className="text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-1.5 text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-mono"
                          style={{ colorScheme: mode }}
                        >
                          {gameOptions.map(opt => (
                            <option key={opt.value} value={opt.value} style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Tone</label>
                        <select
                          value={newArticleTone}
                          onChange={(e) => setNewArticleTone(e.target.value)}
                          className="text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-1.5 text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-mono"
                          style={{ colorScheme: mode }}
                        >
                          {toneOptions.map(opt => (
                            <option key={opt.value} value={opt.value} style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>{opt.value}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5 mt-0.5 text-left">
                      <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Custom prompt instructions</label>
                      <textarea
                        value={customPromptText}
                        onChange={(e) => {
                          setCustomPromptText(e.target.value);
                          setIsPromptUserModified(true);
                        }}
                        placeholder="Type standard prompt rules..."
                        rows={2}
                        className="text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-[var(--text-primary)] w-full focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-sans resize-none scrollbar-thin"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateArticle}
                      disabled={isGeneratingArticle}
                      className="w-full text-xs font-semibold bg-[var(--accent-color)] text-[var(--bg-color)] py-1.5 rounded-xl hover:opacity-95 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5 font-mono shadow-sm mt-0.5"
                    >
                      {isGeneratingArticle ? (
                        <>
                          <Sparkles className="w-3 h-3 animate-spin text-yellow-300" />
                          <span>DEEP WRITER ({generationProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-yellow-300" />
                          <span>GENERATE ARTICLE WITH AI</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Right Column - Deep Active Article view */}
                <div className="md:col-span-3 flex flex-col bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl overflow-hidden h-full">
                  {selectedArticle ? (
                    <div className="flex flex-col h-full overflow-hidden text-left justify-between">
                      
                      {/* Title Bar details */}
                      <div className="p-4 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex-shrink-0 flex justify-between items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--accent-color)] uppercase tracking-wider border border-[var(--card-border)]">
                              {selectedArticle.category}
                            </span>
                            <span className="text-[9px] text-[var(--text-muted)] font-mono bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--card-border)]">
                              {selectedArticle.readTime}
                            </span>
                          </div>
                          <h3 className="text-sm font-extrabold text-[var(--text-primary)] leading-snug line-clamp-1">
                            {selectedArticle.title}
                          </h3>
                        </div>

                        {/* Interactive prompt linkages */}
                        <div className="flex items-center gap-1.5 shrink-0 select-none">
                          <button
                            type="button"
                            onClick={() => setActiveEduTab('flashcards')}
                            className="bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] font-mono text-[9px] font-bold px-2 py-1.5 rounded-xl border border-[var(--accent-color)] flex items-center gap-1 transition-all cursor-pointer"
                            title="Interactive Flashcards deck for this syllabus article"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>STUDY TERMS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveEduTab('quiz')}
                            className="bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] font-mono text-[9px] font-bold px-2 py-1.5 rounded-xl border border-[var(--accent-color)] flex items-center gap-1 transition-all cursor-pointer"
                            title="Generate Quiz based on this syllabus"
                          >
                            <Gamepad2 className="w-3.5 h-3.5" />
                            <span>TAKE TEST</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-4 overflow-y-auto text-left flex-1 min-h-0 scrollbar-thin">
                        {renderFormattedText(selectedArticle.content)}
                      </div>

                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-[var(--text-muted)] font-mono">
                      Select a core paper assignment to read content
                    </div>
                  )}
                </div>

              </div>
            )}

            {activeEduTab === 'flashcards' && (
              <FlashcardsWorkspace 
                refArticle={selectedArticle} 
                onGeneratedSuccess={(targetTab) => setActiveEduTab(targetTab)} 
              />
            )}

            {activeEduTab === 'quiz' && (
              <QuizWorkspace 
                refArticle={selectedArticle} 
                onGeneratedSuccess={(targetTab) => setActiveEduTab(targetTab)} 
              />
            )}

            {activeEduTab === 'grammar' && (
              <GrammarCheckerWorkspace />
            )}

          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col xl:flex-row items-center xl:items-center justify-center p-4 md:p-8 xl:p-12 gap-8 md:gap-10 transition-colors duration-350 relative select-none">
        
        {/* Floating Controls inside Lock Screen */}
        <div className="absolute top-4 right-4 flex items-center gap-3">
          
          {/* Light/Dark Slider */}
          <div className="flex items-center gap-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] py-1.5 px-2.5 rounded-full shadow-sm">
            <div 
              onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
              className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 select-none transition-all duration-300"
              title="Toggle Light/Dark Theme Mode"
            >
              <div 
                className={`w-5 h-5 rounded-full bg-[var(--accent-color)] shadow-md transition-all duration-350 ease-out flex items-center justify-center text-[10px] transform ${
                  mode === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {mode === 'dark' ? '🌙' : '☀️'}
              </div>
            </div>
          </div>

          {/* Theme custom capsule */}
          <div className="border border-[var(--card-border)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <div className="flex items-center gap-1.5">
              {[
                { key: 'cyborg', color: 'bg-green-500 border-green-300 shadow-[0_0_5px_green]', tooltip: 'Cyborg Theme' },
                { key: 'violet', color: 'bg-indigo-600 border-indigo-400', tooltip: 'Violet Theme' },
                { key: 'ice', color: 'bg-sky-400 border-sky-300', tooltip: 'Glacier Theme' },
                { key: 'rose-pine', color: 'bg-rose-300 border-rose-200', tooltip: 'Rose Pine Theme' },
                { key: 'none', color: 'bg-gradient-to-br from-neutral-300 to-neutral-700 border-neutral-400', tooltip: 'No Theme (Monochrome)' }
              ].map((themeOpt) => (
                <button
                  key={themeOpt.key}
                  title={themeOpt.tooltip}
                  onClick={() => setTheme(themeOpt.key)}
                  className={`w-3.5 h-3.5 rounded-full ${themeOpt.color} border transition-all duration-200 hover:scale-130 cursor-pointer ${
                    theme === themeOpt.key ? 'ring-2 ring-offset-2 ring-[var(--accent-color)]' : 'opacity-80'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Lock Card Content Container */}
        <div className={`w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-300 flex flex-col items-center gap-6 flex-shrink-0 ${isShake ? 'animate-shake' : ''}`}>
          
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Portal Secured</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">This is a paid Science, Math, ELA, and Social Studies article website. Please enter a correct password to continue to the website.</p>
          </div>

          {/* Alphanumeric Text/Passcode Input Field */}
          <div className="w-full flex flex-col gap-2.5">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter password..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
                className="w-full px-4 py-2.5 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-sm font-bold font-mono tracking-widest rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] placeholder:text-[10px] placeholder:font-sans placeholder:tracking-normal outline-none transition-all placeholder:opacity-60"
                autoFocus
              />
              {passcode.length > 0 && (
                <button 
                  type="button"
                  onClick={() => setPasscode('')}
                  className="absolute right-3.5 top-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold cursor-pointer"
                  title="Clear input"
                >
                  ✕
                </button>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => handlePasswordSubmit()}
              className="w-full text-xs font-mono font-bold bg-[var(--accent-color)] text-[var(--bg-color)] py-2.5 rounded-xl hover:opacity-95 active:scale-98 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>SUBMIT PASSWORD</span>
            </button>
          </div>

          {/* Indicators for passcode digits */}
          {(!passcode || (!isNaN(passcode) && passcode.length <= 4)) && (
            <div className="flex justify-center gap-4 py-1">
              {[0, 1, 2, 3].map((index) => {
                const isFilled = passcode.length > index;
                return (
                  <div 
                    key={index}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 transform ${
                      isFilled 
                        ? 'bg-[var(--accent-color)] border-[var(--accent-color)] scale-110 shadow-[0_0_8px_var(--accent-shadow)]' 
                        : 'border-[var(--card-border)] bg-[var(--bg-secondary)]'
                    }`}
                  />
                );
              })}
            </div>
          )}

          {/* Secure Pad Grid */}
          <div className="grid grid-cols-3 gap-3.5 w-full max-w-[245px] mt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                onClick={() => handleDigitInput(num)}
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] hover:border-[var(--accent-color)] active:scale-95 hover:scale-105 transition-all duration-150 cursor-pointer shadow-sm mx-auto"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPasscode('')}
              className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--card-border)] hover:bg-[var(--bg-secondary)] active:scale-90 transition-all duration-150 cursor-pointer mx-auto"
            >
              Clear
            </button>
            <button
              onClick={() => handleDigitInput('0')}
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] hover:border-[var(--accent-color)] active:scale-95 hover:scale-105 transition-all duration-150 cursor-pointer shadow-sm mx-auto"
            >
              0
            </button>
            <button
              onClick={() => setPasscode(prev => prev.slice(0, -1))}
              className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--card-border)] hover:bg-[var(--bg-secondary)] active:scale-90 transition-all duration-150 cursor-pointer mx-auto"
            >
              Del
            </button>
          </div>

          {errorCount > 0 && (
            <span className="text-[10.5px] text-red-500 font-medium font-mono animate-bounce mt-1">
              Access Denied! Attempt #{errorCount}
            </span>
          )}

        </div>

        {/* ==================== ARTICLES SECTION ==================== */}
        <div className="w-full max-w-4xl bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 md:p-6 shadow-2xl transition-all duration-300 flex flex-col gap-4 select-text max-h-[90vh] md:h-[600px] overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--card-border)]">
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                <BookOpen className="text-[var(--accent-color)] w-5 h-5" />
                Examples of some articles
              </h3>
            </div>
            <div className="flex items-center gap-1.5 self-start sm:self-auto uppercase tracking-wider text-[10px] font-mono bg-[var(--bg-secondary)] py-1 px-2 rounded-md border border-[var(--card-border)] text-[var(--accent-color)]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-yellow-400" />
              <span>AI generated examples</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0 overflow-hidden">
            {/* Left lists & creator pane (cols 2) */}
            <div className="md:col-span-2 flex flex-col gap-3 overflow-hidden h-full">
              
              {/* Subject Specific Sections */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0 scrollbar-none select-none">
                {['All', 'Science', 'Mathematics', 'ELA', 'Social Studies', 'Italian'].map((cat) => {
                  const isSelected = selectedArticleCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedArticleCategory(cat);
                        const firstInCat = articles.find(art => cat === 'All' || art.category === cat);
                        if (firstInCat) {
                          setSelectedArticleId(firstInCat.id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-mono border font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-98 ${
                        isSelected
                          ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--text-muted)]/50 hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Internal search inside articles */}
              <div className="relative flex-shrink-0">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full text-xs rounded-xl py-1.5 pl-8 pr-3 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] placeholder:opacity-50 transition-all font-mono"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
              </div>

              {/* Feed items */}
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto py-0.5 scrollbar-thin">
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-4 text-xs text-[var(--text-muted)] font-mono">
                    No articles found matching query
                  </div>
                ) : (
                  filteredArticles.map((art) => {
                    const isSelected = art.id === selectedArticleId;
                    return (
                      <div
                        key={art.id}
                        onClick={() => setSelectedArticleId(art.id)}
                        className={`p-2 md:p-2.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-sm scale-[1.01]'
                            : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-muted)]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5 flex-wrap">
                          <span className="text-[8px] font-bold font-mono tracking-wider px-1.5 py-0.5 rounded bg-[var(--input-fill)] text-[var(--accent-color)] uppercase">
                            {art.category}
                          </span>
                          <span className="text-[8px] text-[var(--text-muted)] font-mono">
                            {art.readTime}
                          </span>
                        </div>
                        <h4 className="text-[11px] font-bold leading-snug text-[var(--text-primary)] line-clamp-1">
                          {art.title}
                        </h4>
                        <p className="text-[9px] text-[var(--text-muted)] mt-0.5 font-mono">
                          {art.date}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Creator board container */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl p-3 flex-shrink-0 flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-xs font-bold text-[var(--text-primary)] font-mono">Interactive AI Writer</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Subject</label>
                    <select
                      value={newArticleGame}
                      onChange={(e) => setNewArticleGame(e.target.value)}
                      className="text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-1.5 text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-mono"
                      style={{ colorScheme: mode }}
                    >
                      {gameOptions.map(opt => (
                        <option key={opt.value} value={opt.value} style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Tone</label>
                    <select
                      value={newArticleTone}
                      onChange={(e) => setNewArticleTone(e.target.value)}
                      className="text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-1.5 text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-mono"
                      style={{ colorScheme: mode }}
                    >
                      {toneOptions.map(opt => (
                        <option key={opt.value} value={opt.value} style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>{opt.value}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Customize Prompt</label>
                    {isPromptUserModified && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsPromptUserModified(false);
                        }}
                        className="text-[9px] font-mono text-[var(--accent-color)] hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-none p-0"
                      >
                        Reset to preset
                      </button>
                    )}
                  </div>
                  <textarea
                    value={customPromptText}
                    onChange={(e) => {
                      setCustomPromptText(e.target.value);
                      setIsPromptUserModified(true);
                    }}
                    placeholder="Type a custom prompt for the AI to write about..."
                    rows={2}
                    className="text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-[var(--text-primary)] w-full focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-sans resize-none scrollbar-thin"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateArticle}
                  disabled={isGeneratingArticle}
                  className="w-full text-xs font-semibold bg-[var(--accent-color)] text-[var(--bg-color)] py-1.5 rounded-xl hover:opacity-95 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5 font-mono shadow-sm mt-0.5"
                >
                  {isGeneratingArticle ? (
                    <>
                      <Sparkles className="w-3 h-3 animate-spin text-yellow-300" />
                      <span>DEEP WRITER ({generationProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                      <span>GENERATE ARTICLE WITH AI</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right expanded active details reader card (cols 3) */}
            <div className="md:col-span-3 flex flex-col bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl overflow-hidden h-[300px] md:h-full">
              {selectedArticle ? (
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Article banner */}
                  <div className="p-4 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex-shrink-0">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--accent-color)] uppercase tracking-wider border border-[var(--card-border)]">
                        {selectedArticle.category}
                      </span>
                      <span className="text-[9px] text-[var(--text-muted)] font-mono bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--card-border)]">
                        {selectedArticle.readTime}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-[var(--text-primary)] leading-snug">
                      {selectedArticle.title}
                    </h3>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                      {selectedArticle.subtitle} • {selectedArticle.date}
                    </p>
                  </div>

                  {/* Article body */}
                  <div className="p-4 overflow-y-auto text-left flex-1 min-h-0 scrollbar-thin">
                    {renderFormattedText(selectedArticle.content)}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-[var(--text-muted)] font-mono">
                  Select an article to begin reading
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    );
  }



  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* HEADER */}
      <nav className="border-b border-[var(--card-border)] bg-[var(--header-bg)] py-3.5 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors duration-300 sticky top-0 z-50 shadow-sm">
        
        {/* Left Side: Decoy Classroom Title */}
        <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between w-full sm:w-auto">
          <div 
            onClick={() => { setFilter('all'); setSelectedGame(null); setSearchQuery(''); }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            title={
              decoyType !== 'none' 
                ? `Go to ${
                    decoyType === 'classroom' 
                      ? 'Classroom' 
                      : decoyType === 'clever' 
                      ? 'Clever' 
                      : decoyType === 'campus' 
                      ? 'Campus' 
                      : decoyType === 'docs' 
                      ? 'Google Docs' 
                      : 'Inbox'
                  } homepage` 
                : "Go to StudyTools homepage"
            }
          >
            <div className="p-2 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-lg border border-[var(--card-border)] shadow-[0_2px_8.5px_var(--accent-shadow)] group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 transform">
              {decoyType === 'classroom' ? (
                <School className="w-5.5 h-5.5" />
              ) : decoyType === 'clever' ? (
                <Compass className="w-5.5 h-5.5" />
              ) : decoyType === 'campus' ? (
                <School className="w-5.5 h-5.5" />
              ) : decoyType === 'docs' ? (
                <FileText className="w-5.5 h-5.5" />
              ) : decoyType === 'gmail' ? (
                <Mail className="w-5.5 h-5.5" />
              ) : (
                <BookOpen className="w-5.5 h-5.5" />
              )}
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] block group-hover:text-[var(--accent-color)] transition-colors">
                {decoyType === 'classroom' 
                  ? "Home - Classroom" 
                  : decoyType === 'clever' 
                  ? "Clever | Log in with Clever" 
                  : decoyType === 'campus' 
                  ? "Campus Student" 
                  : decoyType === 'docs' 
                  ? "Google Docs" 
                  : decoyType === 'gmail' 
                  ? "Inbox - Jersey City Public Schools" 
                  : "StudyTools"}
              </span>
            </div>
          </div>

          {/* Sign Out Button right after Classroom */}
          <button
            onClick={() => {
              setViewModeAndSave('articles');
              setPasscode('');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-red-500/50 hover:bg-red-500/10 text-[var(--text-primary)] hover:text-red-500 transition-all duration-200 cursor-pointer shadow-sm group"
            title="Sign Out to Lock Screen"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Middle Search Bar */}
        <div className="relative w-full max-w-sm sm:mx-4">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search school games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm rounded-full py-2.5 pl-9 pr-4 border border-[var(--card-border)] bg-[var(--input-fill)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] placeholder:opacity-50 transition-all duration-300 shadow-inner"
          />
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3 md:gap-4 self-stretch sm:self-auto justify-between sm:justify-end flex-wrap sm:flex-nowrap">
          
          <div className="text-[11px] font-mono select-none opacity-80 pl-1">
            <span className="text-xs opacity-50 block sm:inline mr-1">made by</span>
            <span className="font-bold text-[var(--accent-color)] tracking-wider">™ AND GRANDDIA2</span>
          </div>

          {/* Light/Dark slider */}
          <div className="flex items-center gap-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] py-1 md:py-1.5 px-2.5 rounded-full shadow-sm">
            <div 
              onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
              className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 select-none transition-all duration-300"
              title="Slide to change Mode (Light / Dark)"
            >
              <div 
                className={`w-5 h-5 rounded-full bg-[var(--accent-color)] shadow-md transition-all duration-350 ease-out flex items-center justify-center text-[10px] transform ${
                  mode === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {mode === 'dark' ? '🌙' : '☀️'}
              </div>
            </div>
          </div>

          {/* Theme capsule */}
          <div className="border border-[var(--card-border)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <div className="flex items-center gap-1.5">
              {[
                { key: 'cyborg', color: 'bg-green-500 border-green-300 shadow-[0_0_5px_green]', tooltip: 'Cyborg Theme' },
                { key: 'violet', color: 'bg-indigo-600 border-indigo-400', tooltip: 'Violet Theme' },
                { key: 'ice', color: 'bg-sky-400 border-sky-300', tooltip: 'Glacier Theme' },
                { key: 'rose-pine', color: 'bg-rose-300 border-rose-200', tooltip: 'Rose Pine Theme' },
                { key: 'none', color: 'bg-gradient-to-br from-neutral-300 to-neutral-700 border-neutral-400', tooltip: 'No Theme (Monochrome)' }
              ].map((themeOpt) => (
                <button
                  key={themeOpt.key}
                  title={themeOpt.tooltip}
                  onClick={() => setTheme(themeOpt.key)}
                  className={`w-3.5 h-3.5 rounded-full ${themeOpt.color} border transition-all duration-200 hover:scale-130 cursor-pointer ${
                    theme === themeOpt.key ? 'ring-2 ring-offset-2 ring-[var(--accent-color)]' : 'opacity-80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </nav>

      {/* ALT LINKS BAR */}
      <section className="bg-[var(--bg-secondary)] border-b border-[var(--card-border)] py-3 px-4 md:px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Alt Links Removed */}

          <div className="flex flex-wrap items-center gap-2 md:ml-auto w-full md:w-auto overflow-visible">
            {/* Go back to games back button */}
            {(filter === 'chat' || filter === 'movies') && (
              <button
                id="chat-back-button"
                onClick={() => setFilter('all')}
                className="flex items-center gap-1.5 text-xs font-mono font-bold py-1.5 px-3.5 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] active:scale-98"
                title="Go back to games list"
                aria-label="Back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Go back to games</span>
              </button>
            )}

            {/* Movies Workspace button */}
            <button
              onClick={() => { setFilter(filter === 'movies' ? 'all' : 'movies'); setSelectedGame(null); }}
              className={`text-xs border py-1.5 px-3.5 rounded-full font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-98 ${
                filter === 'movies'
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-extrabold'
                  : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]'
              }`}
              title="Toggle Movies - Stream Movies and TV Shows"
            >
              <Tv className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>Movies</span>
            </button>

            {/* AI Socratic Tutor button */}
            <button
              onClick={() => { setFilter(filter === 'chat' ? 'all' : 'chat'); setSelectedGame(null); }}
              className={`text-xs border py-1.5 px-3.5 rounded-full font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-98 ${
                filter === 'chat'
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-extrabold'
                  : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]'
              }`}
              title="Toggle AI Socratic Tutor - Ask Study/Academic Questions"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>GEMINI AI / GROQ AI</span>
            </button>

            {/* Suffix Select */}
            <div className="flex items-center bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-2.5 py-1.5 text-xs text-[var(--text-muted)] font-mono shadow-sm">
              <span className="text-[10px] uppercase font-extrabold mr-1.5 text-[var(--accent-color)]">Tab Target:</span>
              <select 
                value={aboutBlankSuffix}
                onChange={(e) => setAboutBlankSuffix(e.target.value)}
                className="bg-transparent border-none outline-none font-bold text-[var(--text-primary)] cursor-pointer py-0.5"
                style={{ colorScheme: mode }}
              >
                <option value="" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank (Default)</option>
                <option value="#1" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank#1</option>
                <option value="#2" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank#2</option>
                <option value="#3" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank#3</option>
                <option value="#4" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank#4</option>
                <option value="#5" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank#5</option>
                <option value="#math" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank#math</option>
                <option value="#science" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank#science</option>
                <option value="#grades" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank#grades</option>
                <option value="#classroom" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank#classroom</option>
                <option value="#clever" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank#clever</option>
                <option value="#campus" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank#campus</option>
                <option value="#dashboard" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>about:blank#dashboard</option>
              </select>
            </div>

            <button
              onClick={() => {
                const targetUrl = "about:blank" + aboutBlankSuffix;
                const win = window.open(targetUrl, "_blank");
                if (!win) {
                  alert(`Popup blocked! Please allow popups to open the site in ${targetUrl}.`);
                  return;
                }
                
                // Construct query parameters to propagate the decoy state to the new document
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.set('decoyType', decoyType);
                const iframeSrc = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}${window.location.hash}`;

                const bookSvgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h15M6 10h15"/></svg>`
                )}`;

                let parentTitle = "StudyTools";
                let parentFavicon = bookSvgDataUri;
                
                if (decoyType === 'classroom') {
                  parentTitle = "Home - Classroom";
                  parentFavicon = "https://ssl.gstatic.com/classroom/favicon.png";
                } else if (decoyType === 'clever') {
                  parentTitle = "Clever | Log in with Clever";
                  parentFavicon = "https://www.google.com/s2/favicons?sz=64&domain=clever.com";
                } else if (decoyType === 'campus') {
                  parentTitle = "Campus Student";
                  parentFavicon = "https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png";
                } else if (decoyType === 'docs') {
                  parentTitle = "Google Docs";
                  parentFavicon = "https://www.google.com/s2/favicons?sz=64&domain=docs.google.com";
                } else if (decoyType === 'gmail') {
                  parentTitle = "Inbox - Jersey City Public Schools";
                  parentFavicon = "https://www.google.com/s2/favicons?sz=64&domain=mail.google.com";
                }

                win.document.write(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>${parentTitle}</title>
                    <link rel="icon" type="image/png" href="${parentFavicon}">
                    <meta charset="utf-8">
                    <style>
                      html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #0c0a09; }
                      iframe { width: 100vw; height: 100vh; border: none; display: block; }
                    </style>
                  </head>
                  <body>
                    <iframe src="${iframeSrc}" allow="fullscreen" referrerpolicy="no-referrer"></iframe>
                  </body>
                  </html>
                `);
                win.document.close();

                // Set location hash after writing to force browser to register hash parameter in address bar
                try {
                  if (aboutBlankSuffix) {
                    win.location.hash = aboutBlankSuffix;
                  }
                } catch (e) {
                  // ignore
                }
              }}
              className="text-xs bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--card-border)] py-1.5 px-3.5 rounded-full hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] active:scale-98 transition-all duration-200 font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open entire site inside about:blank tab with selected suffix to cloak history"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--accent-color)] animate-spin-slow" />
              <span>CLOAK IN {aboutBlankSuffix ? `ABOUT:BLANK ${aboutBlankSuffix.toUpperCase()}` : 'ABOUT:BLANK'}</span>
            </button>

            {/* Decoy Mode Selector */}
            <div className={`flex items-center border rounded-full px-3 py-1.5 text-xs font-mono shadow-sm transition-all duration-300 ${
              decoyType !== 'none' 
                ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] text-[var(--accent-color)]' 
                : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-muted)]'
            }`}>
              <span className="text-[10px] uppercase font-extrabold mr-1.5 flex items-center gap-1">
                <School className="w-3.5 h-3.5 animate-pulse" />
                <span>Decoy:</span>
              </span>
              <select 
                value={decoyType}
                onChange={(e) => setDecoyType(e.target.value)}
                className={`bg-transparent border-none outline-none font-bold cursor-pointer py-0.5 ${
                  decoyType !== 'none' ? 'text-[var(--accent-color)]' : 'text-[var(--text-primary)]'
                }`}
                style={{ colorScheme: mode }}
              >
                <option value="none" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Off (StudyTools)</option>
                <option value="classroom" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Google Classroom</option>
                <option value="clever" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Clever Login</option>
                <option value="campus" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Infinite Campus</option>
                <option value="docs" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Google Docs</option>
                <option value="gmail" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>Inbox - Jersey City Public Schools</option>
              </select>
            </div>
          </div>
        </div>
      </section>

            {/* Hidden legacy frame creator to preserve large assets cleanly */}
            <div style={{ display: 'none' }}>
              <button
                onClick={() => {
                  const win = window.open("about:blank", "_blank");
                  if (!win) {
                    alert("Popup blocked! Accessing classroom decoys requires popup permissions.");
                    return;
                  }
                win.document.write(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Classwork - Algebra II</title>
                    <link rel="icon" type="image/png" href="https://ssl.gstatic.com/classroom/favicon.png">
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                      * { box-sizing: border-box; margin: 0; padding: 0; }
                      html, body {
                        width: 100vw;
                        height: 100vh;
                        overflow: hidden;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        background-color: #ffffff;
                        display: flex;
                        flex-direction: column;
                      }
                      
                      /* CLASSROOM HEADER */
                      .classroom-header {
                        height: 64px;
                        background-color: #ffffff;
                        border-bottom: 1px solid #e0e0e0;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 16px;
                        position: relative;
                        user-select: none;
                      }
                      
                      .header-left { display: flex; align-items: center; gap: 12px; }
                      
                      .menu-btn {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: #5f6368;
                      }
                      .menu-btn:hover { background-color: rgba(95, 99, 104, 0.04); }
                      
                      .classroom-logo { display: flex; align-items: center; gap: 8px; cursor: pointer; }
                      .classroom-logo img { width: 24px; height: 24px; }
                      .classroom-logo span {
                        font-size: 22px;
                        color: #5f6368;
                        font-weight: 400;
                        font-family: Arial, sans-serif;
                      }
                      
                      .course-title-section {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-left: 8px;
                        border-left: 1px solid #dadce0;
                        padding-left: 16px;
                      }
                      
                      .course-title { font-size: 16px; color: #3c4043; font-weight: 500; }
                      .course-section { font-size: 12px; color: #5f6368; }
                      
                      /* TABS */
                      .header-middle {
                        display: flex;
                        align-items: center;
                        gap: 24px;
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        height: 100%;
                      }
                      
                      .tab {
                        height: 100%;
                        display: flex;
                        align-items: center;
                        padding: 0 8px;
                        font-size: 14px;
                        font-weight: 500;
                        color: #5f6368;
                        cursor: pointer;
                        border-bottom: 3px solid transparent;
                      }
                      .tab:hover { color: #137333; background-color: rgba(19, 115, 51, 0.04); }
                      .tab.active { color: #137333; border-bottom-color: #137333; }
                      
                      /* RIGHT SIDE */
                      .header-right { display: flex; align-items: center; gap: 8px; }
                      
                      .icon-btn {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: #5f6368;
                      }
                      .icon-btn:hover { background-color: rgba(95, 99, 104, 0.04); }
                      
                      .avatar {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        background-color: #1a73e8;
                        color: #ffffff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 500;
                        margin-left: 8px;
                        cursor: pointer;
                      }
                      
                      /* MAIN CONTENT */
                      .main-body {
                        flex: 1;
                        position: relative;
                        width: 100%;
                        height: calc(100vh - 64px);
                        background-color: #ffffff;
                      }
                      
                      iframe { width: 100%; height: 100%; border: none; display: block; }
                      
                      .decoy-content {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: #ffffff;
                        display: none;
                        padding: 32px;
                        overflow-y: auto;
                      }
                      
                      .decoy-active #game-iframe { display: none; }
                      .decoy-active .decoy-content { display: block; }
                    </style>
                  </head>
                  <body>
                    <!-- Header -->
                    <div class="classroom-header">
                      <div class="header-left">
                        <div class="menu-btn" id="menu-btn-click">
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                          </svg>
                        </div>
                        <div class="classroom-logo" id="brand-logo-click">
                          <img src="https://ssl.gstatic.com/classroom/favicon.png" alt="Classroom Logo">
                          <span>Classroom</span>
                        </div>
                        <div class="course-title-section" id="course-banner-click" style="cursor: pointer;">
                          <div class="course-title">Algebra II</div>
                          <div class="course-section">&nbsp;- Honors Period 3</div>
                        </div>
                      </div>
                      
                      <div class="header-middle">
                        <div class="tab">Stream</div>
                        <div class="tab active">Classwork</div>
                        <div class="tab">People</div>
                        <div class="tab">Grades</div>
                      </div>
                      
                      <div class="header-right">
                        <div class="icon-btn">
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M20 18H4v-7h16v7zm1-9h-3V6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v3H3c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h18c1.1 0-2-.9-2-2v-9c0-1.1-.9-2-2-2zm-3-3v3H8V6h10z"/>
                          </svg>
                        </div>
                        <div class="icon-btn">
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
                          </svg>
                        </div>
                        <div class="icon-btn" style="margin-right: 4px;">
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
                        </div>
                        <div class="avatar">S</div>
                      </div>
                    </div>
                    
                    <!-- Main Body Area -->
                    <div class="main-body" id="main-body">
                      <iframe id="game-iframe" src="${window.location.origin}${window.location.pathname}${window.location.search}" allow="fullscreen" referrerpolicy="no-referrer"></iframe>
                      
                      <!-- Decoy Homework Board -->
                      <div class="decoy-content">
                        <div style="background-color: #137333; color: white; padding: 24px 32px; border-radius: 8px; margin-bottom: 24px; text-align: left;">
                          <h1 style="font-size: 26px; font-weight: 400; margin-bottom: 6px; font-family: Roboto, Arial, sans-serif;">Algebra II - Period 3 Homework & Resource Portal</h1>
                          <p style="font-size: 14px; opacity: 0.9; font-family: Roboto, Arial, sans-serif;">Honors Mathematics Course Resources</p>
                        </div>

                        <div style="display: flex; gap: 24px; text-align: left; font-family: Roboto, Arial, sans-serif; flex-wrap: wrap;">
                          <div style="flex: 2; min-width: 300px;">
                            <div style="background: white; border: 1px solid #dadce0; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #dadce0; padding-bottom: 16px; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
                                <div>
                                  <h2 style="font-size: 20px; font-weight: 500; color: #1967d2; margin-bottom: 4px;">Interactive Graphing Lab & Exercises</h2>
                                  <p style="font-size: 12px; color: #5f6368;">Teacher: Mrs. Katherine Vance &bull; Assigned: Jun 4</p>
                                </div>
                                <div style="text-align: right; min-width: 120px;">
                                  <p style="font-size: 14px; font-weight: 500; color: #3c4043;">100 points</p>
                                  <p style="font-size: 12px; color: #c5221f; font-weight: 500;">Due Tomorrow, 11:59 PM</p>
                                </div>
                              </div>

                              <p style="font-size: 14px; color: #3c4043; line-height: 1.6; margin-bottom: 16px;">
                                Use the web interactive math sandbox or scientific plotter loaded below to map standard polynomial structures and quadratic graphs. Note the curves, intersections, and coordinates. Fill in the homework matrix PDF when complete.
                              </p>
                              
                              <div style="border: 1px solid #dadce0; border-radius: 8px; overflow: hidden; height: 400px; margin-top: 16px; background-color: #f1f3f4;">
                                <iframe src="https://www.desmos.com/calculator" style="width:100%; height:100%; border:0;" referrerpolicy="no-referrer"></iframe>
                              </div>
                            </div>
                          </div>

                          <div style="flex: 1; min-width: 240px; max-width: 300px;">
                            <div style="background: white; border: 1px solid #dadce0; border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                              <h3 style="font-size: 16px; font-weight: 500; color: #3c4043; margin-bottom: 16px;">Your work</h3>
                              <div style="border: 1px dashed #dadce0; border-radius: 4px; padding: 24px; text-align: center; margin-bottom: 16px; font-size: 12px; color: #5f6368;">
                                No files attached
                              </div>
                              <button style="width: 100%; background: #1a73e8; color: white; border: none; border-radius: 4px; padding: 10px 16px; font-size: 14px; font-weight: 500; cursor: pointer; margin-bottom: 8px;">
                                + Add or create
                              </button>
                              <button style="width: 100%; background: transparent; border: 1px solid #dadce0; color: #1a73e8; border-radius: 4px; padding: 10px 16px; font-size: 14px; font-weight: 500; cursor: pointer;">
                                Mark as done
                              </button>
                            </div>

                            <div style="background: white; border: 1px solid #dadce0; border-radius: 8px; padding: 16px;">
                              <h3 style="font-size: 14px; font-weight: 500; color: #3c4043; margin-bottom: 8px;">Private comments</h3>
                              <p style="font-size: 12px; color: #5f6368; margin-bottom: 8px;">Send a private comment to Mrs. Vance</p>
                              <input placeholder="Add private comment..." style="width:100%; border: 1px solid #dadce0; padding: 8px 12px; font-size: 12px; border-radius: 4px; outline: none; box-sizing: border-box;" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <script>
                      var isDecoy = false;
                      function togglePanic() {
                        isDecoy = !isDecoy;
                        if (isDecoy) {
                          document.getElementById('main-body').classList.add('decoy-active');
                        } else {
                          document.getElementById('main-body').classList.remove('decoy-active');
                        }
                      }
                      
                      // Esc key triggers emergency switch to real study material
                      window.addEventListener('keydown', function(e) {
                        if (e.key === 'Escape' || e.key === '\\x60') {
                          togglePanic();
                        }
                      });
                      
                      // Clicking on banner/logo acts as interactive quick toggle
                      document.getElementById('course-banner-click').addEventListener('click', togglePanic);
                      document.getElementById('brand-logo-click').addEventListener('click', togglePanic);
                      document.getElementById('menu-btn-click').addEventListener('click', togglePanic);
                    </script>
                  </body>
                  </html>
                `);
                win.document.close();
              }}
              className="hidden"
            >
              <span>HIDDEN LEGACY BUTTON</span>
            </button>
            </div>

      {/* MAIN CONTAINER: SIDEBAR + GAMES */}
      <div className={`flex-1 flex flex-col md:flex-row w-full mx-auto transition-all duration-300 ${
        (filter === 'chat' || filter === 'movies')
          ? 'max-w-none p-0 gap-0 border-t border-[var(--card-border)]/50 lg:bg-[#07090e]' 
          : 'max-w-8xl p-4 md:p-6 gap-6 self-center'
      }`}>
        
        {/* LEFT NAV PANEL - CAT SIDEBAR */}
        {filter !== 'chat' && filter !== 'movies' && (
          <aside className={`transition-all duration-300 ease-in-out shrink-0 flex flex-col gap-2 overflow-hidden ${
            sidebarOpen ? 'w-full md:w-64' : 'w-full md:w-14'
          }`}>
            
            <div className="flex items-center justify-between px-2 py-1 min-h-[36px]">
              {sidebarOpen ? (
                <span className="text-[10px] font-mono tracking-wider opacity-50 uppercase whitespace-nowrap">
                  Browse Portals
                </span>
              ) : (
                <span className="hidden md:inline text-[9px] font-mono tracking-wider opacity-50 uppercase text-center mx-auto font-bold text-[var(--accent-color)]">
                  NAV
                </span>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg hover:bg-[var(--card-bg)] text-[var(--accent-color)] transition-all duration-250 cursor-pointer flex items-center justify-center ml-auto"
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 animate-bounce" />}
              </button>
            </div>


            <button
              onClick={() => setFilter('info')}
              className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
                filter === 'info' 
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-lg shadow-[var(--accent-color)]/20' 
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <Info className="w-4.5 h-4.5 shrink-0" />
              <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Information</span>
            </button>

            <button
              onClick={() => { window.open('https://forms.gle/YCN8itY7WqmN82CY8', '_blank'); }}
              className="w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80"
            >
              <ExternalLink className="w-4.5 h-4.5 shrink-0" />
              <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Request a Game</span>
            </button>

            <button
              onClick={() => { setFilter('all'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'all' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Layers className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>All Classrooms</span>
          </button>

          <button
            onClick={() => { setFilter('classroom6x'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'classroom6x' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <School className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Classroom6x Games</span>
          </button>

          <button
            onClick={() => { setFilter('single'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'single' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Gamepad2 className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Single Player</span>
          </button>

          <button
            onClick={() => { setFilter('multiplayer'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'multiplayer' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Users className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Multiplayer</span>
          </button>

          <button
            onClick={() => { setFilter('Shooter'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'Shooter' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Globe className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Shooter</span>
          </button>

          <button
            onClick={() => { setFilter('Party'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'Party' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Globe className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Party</span>
          </button>

          <button
            onClick={() => { setFilter('Sports'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'Sports' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Globe className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Sports</span>
          </button>
          
          <button
            onClick={() => { setFilter('Random'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'Random' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Shuffle className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Random Games</span>
          </button>

          <button
            onClick={() => { setFilter('Emulated'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'Emulated' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Cpu className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Emulated</span>
          </button>

          <button
            onClick={() => { setFilter('minecraft'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'minecraft' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Box className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Minecraft</span>
          </button>

          <button
            onClick={() => { setFilter('Not Games'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'Not Games' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Globe className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Other Websites</span>
          </button>

          {/* BROWSE PORTALS SUBSECTION (portal categories) */}
          {sidebarOpen && (
            <div className="mt-4 mb-1 px-2 py-1">
              <span className="text-[10px] font-mono tracking-wider opacity-50 uppercase whitespace-nowrap">
                Browse Portals
              </span>
            </div>
          )}
          {!sidebarOpen && (
            <div className="hidden md:flex justify-center mt-3 mb-1">
              <span className="text-[9px] font-mono tracking-wider opacity-50 uppercase font-bold text-[var(--accent-color)]">
                ◆
              </span>
            </div>
          )}

          {portalList.map((portal) => {
            const isActive = activePortal === portal.slug;
            return (
              <button
                key={portal.slug}
                onClick={() => {
                  setActivePortal(portal.slug);
                  setFilter('portal');
                  setSelectedGame(null);
                }}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive && filter === 'portal' && !selectedGame
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                    : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
                }`}
                title={`Open ${portal.label} portal`}
              >
                <Gamepad2 className="w-4 h-4 shrink-0" />
                <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>
                  {portal.label}
                </span>
              </button>
            );
          })}

          <div className="flex-1" />

          <button
            onClick={() => setIsGlobalSettingsOpen(true)}
            className="w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80 mt-auto"
          >
            <Settings className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Settings</span>
          </button>

        </aside>
        )}

        {/* GLOBAL SETTINGS MODAL */}
        {isGlobalSettingsOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center select-none">
            <div 
              onClick={() => setIsGlobalSettingsOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-md bg-[#14141c] border border-white/10 rounded-2xl p-6 flex flex-col shadow-2xl z-10 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[var(--accent-color)]" />
                  <h3 className="text-lg font-black uppercase tracking-wider text-white">System Settings</h3>
                </div>
                <button 
                  onClick={() => setIsGlobalSettingsOpen(false)}
                  className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">One-Click Backup & Restore</h4>
                  <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                    Export your favorited games, bookmarked films, watch history, and chat nickname to a JSON file. Use it to carry your profile across devices.
                  </p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        const data = {
                          favorites: safeStorage.getItem('unblocked-favorites'),
                          moviesBookmarks: safeStorage.getItem('movies-bookmarks'),
                          moviesHistory: safeStorage.getItem('movies-history'),
                          chatName: safeStorage.getItem('chat_name')
                        };
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'unblocked-backup.json';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="flex-1 py-2 px-4 rounded-xl text-xs font-mono font-bold uppercase text-center bg-[var(--accent-color)] text-[var(--bg-color)] hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Data
                    </button>
                    
                    <label className="flex-1 py-2 px-4 rounded-xl text-xs font-mono font-bold uppercase text-center bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/5 hover:border-white/20 flex items-center justify-center gap-2">
                      <input 
                        type="file" 
                        accept=".json" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const data = JSON.parse(event.target.result);
                              if (data.favorites) safeStorage.setItem('unblocked-favorites', data.favorites);
                              if (data.moviesBookmarks) safeStorage.setItem('movies-bookmarks', data.moviesBookmarks);
                              if (data.moviesHistory) safeStorage.setItem('movies-history', data.moviesHistory);
                              if (data.chatName) safeStorage.setItem('chat_name', data.chatName);
                              
                              if (data.favorites) setFavorites(JSON.parse(data.favorites));
                              alert("Data restored successfully!");
                            } catch (err) {
                              alert("Invalid backup file.");
                            }
                          };
                          reader.readAsText(file);
                        }} 
                      />
                      <Upload className="w-4 h-4" />
                      Import Data
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY DISPLAY */}
        <main className="flex-1 min-w-0">
          
          {!selectedGame ? (
            filter === 'chat' ? (
              <div className="flex flex-col w-full h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] min-h-[550px] animate-fade-in bg-[var(--bg-secondary)]">
                <ChatWorkspace onClose={() => setFilter('all')} />
              </div>
            ) : filter === 'info' ? (
              <div className="flex flex-col w-full h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] min-h-[550px] animate-fade-in bg-[var(--bg-secondary)]">
                <InformationSection onClose={() => setFilter('all')} />
              </div>
            ) : filter === 'movies' ? (
              <div className="flex flex-col w-full h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] min-h-[550px] animate-fade-in bg-[var(--bg-secondary)]">
                <MoviesWorkspace onClose={() => setFilter('all')} />
              </div>
            ) : filter === 'portal' && activePortal ? (
              // Browse Portals: clean iframe, no header or close button
              <div className="flex flex-col w-full h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] min-h-[550px] animate-fade-in bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--card-border)]/50">
                <iframe
                  key={activePortal}
                  src={`/category/${activePortal}.html`}
                  className="w-full flex-1 border-none bg-white"
                  title={`${activePortal} portal`}
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
                />
              </div>
            ) : filter === 'classroom6x' ? (
              <div className="flex flex-col w-full h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] min-h-[550px] animate-fade-in bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--card-border)]/50">
                <div className="flex justify-between items-center bg-[#14141c] px-4 py-3 border-b border-[var(--card-border)]/50 shrink-0">
                  <div className="flex items-center gap-2">
                    <School className="w-5 h-5 text-[var(--accent-color)]" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Classroom6x Games</h3>
                  </div>
                  <button 
                    onClick={() => setFilter('all')}
                    className="text-xs font-mono px-3 py-1 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded transition-all cursor-pointer"
                  >
                    Close Portal
                  </button>
                </div>
                <iframe 
                  src="/classroom6x.html" 
                  className="w-full flex-1 border-none bg-[#211328]" 
                  title="Classroom6x Games"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
              
              <div className="flex justify-between items-center border-l-4 border-[var(--accent-color)] pl-3">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-[var(--text-primary)]">
                    {filter === 'all' && 'Games Library'}
                    {filter === 'favorites' && 'Bookmarked Games'}
                    {filter === 'single' && 'Singleplayer Arcades'}
                    {filter === 'multiplayer' && 'Multiplayer Hub'}
                    {filter === 'Shooter' && 'Shooter Games'}
                    {filter === 'Party' && 'Party Games'}
                    {filter === 'Sports' && 'Sports Games'}
                    {filter === 'Random' && 'Random Games'}
                    {filter === 'Emulated' && 'Emulated Archives'}
                    {filter === 'minecraft' && 'Minecraft Platform'}
                    {filter === 'Not Games' && 'Not Games'}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Showing {filteredGames.length} unblocked resources
                  </p>
                </div>
              </div>

              {filteredGames.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[var(--card-border)] rounded-2xl bg-[var(--bg-secondary)]">
                  <Gamepad2 className="w-16 h-16 text-[var(--text-muted)] stroke-1 opacity-40 animate-pulse" />
                  <p className="text-sm font-semibold mt-4 text-[var(--text-primary)]">No games found matches filter</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Try searching a different keyword or resetting filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredGames.map(game => {
                    const isFav = favorites.includes(game.id);
                    return (
                      <div 
                        key={game.id}
                        onClick={() => { setSelectedGame(game); setZoom(1); }}
                        className="custom-card flex flex-col rounded-xl overflow-hidden cursor-pointer h-[360px]"
                        style={{ contentVisibility: 'auto' }}
                      >
                        {/* Artwork container */}
                        <div className="relative h-48 bg-neutral-950 flex-shrink-0 flex items-center justify-center border-b border-[var(--card-border)] overflow-hidden">
                          {game.thumbnail && !failedThumbnails[game.id] ? (
                            <img 
                              src={game.thumbnail} 
                              alt={game.title} 
                              referrerPolicy="no-referrer"
                              onError={() => setFailedThumbnails(prev => ({ ...prev, [game.id]: true }))}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                            />
                          ) : (
                            renderGameArt(game)
                          )}

                          <span className="absolute top-2.5 right-2.5 text-[8px] font-bold uppercase tracking-widest bg-black/75 backdrop-blur-sm text-white border border-white/10 px-2.5 py-0.5 rounded-full inline-block z-10">
                            {game.category}
                          </span>

                          <button
                            onClick={(e) => toggleFavorite(e, game.id)}
                            className="absolute top-2.5 left-2.5 p-1.5 rounded-full bg-black/40 hover:bg-black/80 text-white/90 border border-white/10 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all duration-200"
                            title={isFav ? "Remove Bookmark" : "Add Bookmark"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                        </div>

                        {/* Title and descriptions */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h3 className="text-sm font-black text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent-color)] leading-snug">
                              {game.title}
                            </h3>
                            <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                              {game.description}
                            </p>
                          </div>

                          <button
                            onClick={() => { setSelectedGame(game); setZoom(1); }}
                            className="w-full mt-3 border border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-black hover:font-bold hover:shadow-[0_0_12px_calc(var(--accent-color))] text-[11px] font-semibold tracking-wider text-[var(--accent-color)] py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 self-end"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Open Article</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )
        ) : selectedGame.title === 'Bloons TD 5 Sandbox' ? (
          <div className="flex flex-col gap-4 animate-fade-in bg-[#0c0f16]/90 p-4 md:p-6 rounded-2xl border border-zinc-800 shadow-2xl">
            <div className="flex justify-start">
              <button
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-2 border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all font-mono py-1.5 px-3.5 rounded-lg text-xs font-bold bg-[var(--bg-secondary)] leading-normal cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go back to game grid</span>
              </button>
            </div>
            <BloonsSandbox onClose={() => setSelectedGame(null)} />
          </div>
        ) : (
            /* ACTIVE GAME SCREEN */
            <div className="flex flex-col gap-4 animate-fade-in">
              
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-[var(--card-border)] bg-[var(--bg-secondary)] rounded-xl py-3 px-4 gap-3 shadow-inner">
                
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all font-mono py-1.5 px-3.5 rounded-lg text-xs font-bold leading-normal cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Go back</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    {selectedGame.title}
                    <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded border border-[var(--card-border)] bg-[var(--bg-color)] text-[var(--accent-color)]">
                      {selectedGame.category}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  
                  {/* Zoom controls */}
                  <div className="flex items-center bg-[var(--bg-color)] border border-[var(--card-border)] rounded-lg overflow-hidden p-0.5">
                    <button
                      onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
                      className="p-1 px-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded transition-colors"
                      title="Zoom Out"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] px-2 font-mono text-[var(--text-primary)] font-bold select-none">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom(z => Math.min(1.8, z + 0.1))}
                      className="p-1 px-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded transition-colors"
                      title="Zoom In"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setZoom(1)}
                      className="p-1 px-1.5 text-xs text-[var(--accent-color)] font-mono hover:bg-[var(--card-bg)] rounded transition-colors"
                      title="Reset Zoom"
                    >
                      Res
                    </button>
                  </div>

                  {/* Reload button */}
                  <button
                    onClick={() => {
                      const iframe = document.getElementById('game-frame');
                      if (iframe) iframe.src = iframe.src;
                    }}
                    className="p-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] rounded-lg text-[var(--text-primary)] transition-all cursor-pointer"
                    title="Reload game frame session"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Fullscreen button */}
                  <button
                    onClick={() => {
                      const container = document.getElementById('frame-viewport');
                      if (container) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          container.requestFullscreen();
                        }
                      }
                    }}
                    className="flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-1.5 px-3 rounded-lg text-xs font-mono text-[var(--text-primary)] font-medium transition-all cursor-pointer"
                    title="Toggle Fullscreen Arena"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px] font-bold">FULLSCREEN</span>
                  </button>

                  {/* Open in New Tab button */}
                  <button
                    onClick={() => {
                      const win = window.open("about:blank", "_blank");
                      if (!win) {
                        alert("Popup blocked. Allow popups for this site.");
                        return;
                      }

                      const bookSvgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
                        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h15M6 10h15"/></svg>`
                      )}`;
                      let tabTitle = selectedGame.title;
                      let tabFavicon = bookSvgDataUri;
                      if (decoyType === 'classroom') {
                        tabTitle = "Home - Classroom";
                        tabFavicon = "https://ssl.gstatic.com/classroom/favicon.png";
                      } else if (decoyType === 'clever') {
                        tabTitle = "Clever | Log in with Clever";
                        tabFavicon = "https://www.google.com/s2/favicons?sz=64&domain=clever.com";
                      } else if (decoyType === 'campus') {
                        tabTitle = "Campus Student";
                        tabFavicon = "https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png";
                      } else if (decoyType === 'docs') {
                        tabTitle = "Google Docs";
                        tabFavicon = "https://www.google.com/s2/favicons?sz=64&domain=docs.google.com";
                      } else if (decoyType === 'gmail') {
                        tabTitle = "Inbox - Jersey City Public Schools";
                        tabFavicon = "https://www.google.com/s2/favicons?sz=64&domain=mail.google.com";
                      }

                      win.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>${tabTitle}</title>
                          <link rel="icon" href="${tabFavicon}">
                          <link rel="shortcut icon" href="${tabFavicon}">
                          <meta charset="utf-8">
                          <style>
                            html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #ffffff; }
                            iframe { width: 100vw; height: 100vh; border: none; display: block; }
                          </style>
                        </head>
                        <body>
                          <iframe src="${selectedGame.url}" allow="fullscreen" referrerpolicy="no-referrer"></iframe>
                        </body>
                        </html>
                      `);
                      win.document.close();
                    }}
                    className="flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-1.5 px-3 rounded-lg text-xs font-mono text-[var(--text-primary)] font-medium transition-all cursor-pointer"
                    title="Open Game in New Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px] font-bold">OPEN IN NEW TAB</span>
                  </button>

                  {/* Panic Key / Escape to Academic Articles */}
                  <button
                    onClick={() => {
                      setViewModeAndSave('articles');
                      setSelectedGame(null);
                    }}
                    className="flex items-center gap-1.5 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 py-1.5 px-3 rounded-lg text-xs font-mono text-red-500 font-medium transition-all cursor-pointer whitespace-nowrap"
                    title="Panic escape key (or press [ or ] at any time)"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span className="hidden sm:inline text-[10px] font-bold">PANIC ESCAPE ([ or ])</span>
                  </button>

                </div>

              </div>

              {/* Game Viewport Container */}
              <div 
                id="frame-viewport"
                className="w-full h-[65vh] min-h-[420px] rounded-2xl border border-[var(--card-border)] bg-black overflow-hidden relative shadow-lg"
              >
                <div 
                  className="w-full h-full duration-150 transition-transform origin-top-left"
                  style={{ 
                    transform: `scale(${zoom})`,
                    width: `${100 / zoom}%`,
                    height: `${100 / zoom}%`
                  }}
                >
                  <iframe 
                    id="game-frame"
                    src={selectedGame.url} 
                    className="w-full h-full border-none"
                    title={selectedGame.title}
                    allowFullScreen
                    referrerPolicy="no-referrer"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
