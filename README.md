# WUSTL Abroad

A social networking platform specifically designed for WUSTL students studying abroad to connect, coordinate, and communicate across Europe. Please feel free to look through the code.

## Table of Contents
* [Usage](#usage)
* [Authentication](#authentication)
* [Technologies](#technologies)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Demo](#demo)

## Usage

This app provides a streamlined suite of features for student connectivity:
* **The Bulletin Board:** A centralized hub where students can post travel plans by city (e.g., Edinburgh, Prague) to find peers heading to the same destinations.
* **Social Handshake Manager:** A robust system for joining specific trips and viewing the "Squad List," allowing for a verified and secure social layer of confirmed travelers.
* **Real-Time City Chat:** A bi-directional messaging system that allows students looking at the same city to communicate instantly to coordinate meetups and logistics.
* **Live Attendee Sync:** A dedicated system to track exactly who has committed to which trip, ensuring transparency and coordination within the community.
* **Neo-Brutalist Dashboard:** A high-utility, high-contrast interface designed for quick access to city boards and active travel conversations.

## Authentication

* **Secure Data Retrieval:** User data, trip details, and attendee relationships are stored in a **Neon PostgreSQL** database, managed by an Express REST API.
* **Protected Routes:** Users must sign up or log in to access the travel boards or messaging features. Unauthorized users are redirected to the login screen to protect the student community's privacy.
* **Relational Mapping:** The system tracks many-to-many relationships (participants per trip) and message history between specific user IDs to maintain data integrity and session persistence.

## Technologies

* **Languages:** TypeScript, JavaScript, HTML, CSS
* **Frontend:** React (Vite), Tailwind CSS 4
* **Server/Database:** Node.js (Express), Neon PostgreSQL
* **Libraries:** Socket.io, Lucide Icons, React Router
* **Architecture:** RESTful API with a decoupled frontend/backend structure and WebSocket integration

## Contributing

If you'd like to contribute, please let me know! I would be glad to work on it more if someone wants to work on it with me to help WUSTL students stay connected abroad.

## License

No license, but you can use this code; however, please credit me.

## Contact

If you have any questions or want to contribute somehow, email me at adithvasu978@gmail.com

## Demo

No demo yet due to the overusage of NeonDB, but a YouTube link will be posted soon showing the city-switching board, the trip-joining handshake, and the live messaging functionality.