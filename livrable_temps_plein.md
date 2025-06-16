# **Stratégie de répartition des efforts de test par sprint**

## Les 3 axes fonctionnels (Jeu, Exercice, Utilisateur)
## Les 3 critères (User Base, Impact thérapeutique, Impact Image).

---

### **Grille d’évaluation par critère**

| Fonctionnalité  |  User Base | Impact thérapeutique   |  Impact image | **Total (max 30)** |
| --------------- |------------|------------------------|---------------| ------------------ |
| **Jeu**         | 9/10       | 10/10                  | 10/10         | **29/30**          |
| **Exercice**    | 7/10       | 8/10                   | 8/10          | **23/30**          |
| **Utilisateur** | 9/10       | 6/10                   | 8/10          | **23/30**          |

---

### **Justification de la répartition des 25 points de test pour un sprint**

| Fonctionnalité  | Score pondéré | Points attribués | **Raisons**                                                                                                                                               |
| --------------- | ------------- | ---------------- |-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Jeu**         | 29            | **10 pts**       | Partie la plus critique du système. Elle représente la **valeur thérapeutique directe** et doit être **fiable à 100 %**, surtout pour notre public cible. |
| **Utilisateur** | 23            | **8 pts**        | Base nécessaire à l’expérience. Sans utilisateur, pas de progression possible. **Important mais moins risqué** sur l’image thérapeutique.                 |
| **Exercice**    | 23            | **7 pts**        | Utile pour la personnalisation, mais le système peut fonctionner temporairement avec des exercices pré-définis. **Moins bloquant à court terme.**         |

---

### **Résumé**

> Pour ce sprint, nous concentrons nos tests sur **le cœur de l'expérience utilisateur et thérapeutique** :
>
> 1. **Le jeu** : flux de drag & drop, feedbacks, aides, boutons → 10 pts
> 2. **L’utilisateur** : création, validation, affichage dans les listes → 8 pts
> 3. **Les exercices** : création/modification, cohérence, jouabilité → 7 pts
