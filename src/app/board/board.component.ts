/*
Board on ns. toiminnallinen eli "älykäs" komponentti joka sisältää
sovelluslogiikan.
*/
import { Component, OnInit } from '@angular/core';
import { Score } from '../score';
import { ScoreService } from '../score.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  // Pelin tila eli state tallennetaan squares -taulukkoon
  squares: any[]; // Taulukko jossa on eri tyyppisiä arvoja: null, 'X', '0'
  xIsNext: boolean; // Kertoo kumpi on seuraavaksi vuorossa
  winner: string; // Kertoo voittajan 'X' tai '0'
  // tee boolean muuttuja joka ilmaisee tasapelin
  tie: boolean;
  // muuttuja moves joka pitää kirjaa siirtojen määrästä
  moves: number;
  scores: Score;
  line: number[]; // muuttuja, jossa on voittajan rivin indeksit

  constructor(private scoreService: ScoreService) {}

  ngOnInit() {
    // localstoragen alustus
    if (!this.scores) {
      this.scoreService.initScores();
    }
    this.newGame(); // newGame suoritetaan aina kun komponentti alustetaan
  }
  // newGame() -metodin suoritus käynnistää uuden pelin
  newGame() {
    // Kun uusi peli alkaa, pelin muuttujat alustetaan.
    // Squares-taulukkoon laitetaan 9 tyhjää paikkaa
    this.squares = Array(9).fill(null);
    // muuta tähän truen paikalle lause, jolla edellisen pelin hävinnyt saa aloittaa
    // ternäärinen operaattori
    // ehto ? arvo jos ehto on true : arvo jos ehto on false
    // onko this.xIsNext : true ? false;
    this.xIsNext = this.xIsNext ? true : false;
    /*
    if(this.xIsNext){
      this.xIsNext = true;
    } else{
      this.xIsNext = false;
    }

    */
    this.winner = null;
    // tasapeli on false
    this.tie = false;
    // moves on alussa 0
    this.moves = 0;
    // Vanha pistetilanne haetaan kun peli käynnistyy
    this.scores = this.scoreService.getScores();

    this.line = [null, null, null];
  }

  nullifyScores() {
    this.scoreService.initScores();
    this.scores = this.scoreService.getScores();
  }

  /*
   Tässä on sovelluksen model eli tietomalli. Se muodostuu
   risteistä ja nollista jotka välitetään ruutuihin player-
   get propertyn kautta. Get property joka on TS:n piirre,
   tarjoilee vuorotellen ristin tai nollan.
   */
  get player() {
    // ternäärinen operaattori joka korvaa if-elsen
    return this.xIsNext ? 'X' : '0';
    /*
        if (this.xIsNext) {
            return 'X';
        } else {
            return '0';
        }
        */
  }

  // makeMove(index: number) laittaa ristin tai nollan squares -taulukkoon indeksiin index
  makeMove(index: number) {
    /* jos peli on loppunut, niin tehdään tähän return, jolloin ei voida
    enää tehdä siirtoa, koska ollaan poistuttu metodista. */
    if (this.moves < 9 && this.winner !== null) {
      return null; // poistutaan metodista ja ei päästä tekemään siirtoa.
    }
    // Paikan johon risti tai nolla laitetaan pitää olla tyhjä, eli null
    if (!this.squares[index]) {
      // splice-metodi poistaa indeksistä alkion ja laittaa
      // tilalle yhden alkion joka tulee this.player -get propertyltä
      this.squares.splice(index, 1, this.player);
      this.xIsNext = !this.xIsNext; // Vaihdetaan vuoroa
      this.moves++;
    }
    // Yritetään määritellä voittaja. Metodi tuottaa 'X', '0' tai null
    // tilanteesta riippuen. Jos voittaja on olemassa, se näytetään templaatissa.
    this.winner = this.calculateWinner();

    // tässä tutkitaan onko pelissä voittaja ja onko kaikki siirrot tehty
    // jos näin on, niin tasapeli on true

    if (this.moves === 9 && this.winner === null) {
      this.tie = true;
    }
  }
  // Metodi joka määrittää pelin voittajan
  calculateWinner() {
    const lines = [
      // kaikki yhdistelmät (indexit), joilla pelin voi voittaa
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        // pelin voittaja löytyy tässä
        // otetaan talteen voittaja
        console.log(line);
        this.line = line;
        // lisätään scorea voittajalle
        this.scoreService.addScore(this.squares[a]);
        // päivitetään tilanne this.scores -muuttujaan
        this.scores = this.scoreService.getScores();
        return this.squares[a]; // palautetaan 'X' tai '0'
      }
    }
    return null;
  }
}
