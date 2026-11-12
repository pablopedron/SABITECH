export class Charla {
	constructor({  
        id,
        titulo,
        descripcion,
        lugar,
        direccion,
        fecha,
        hora,
        horaFin,
        ponente,
        empresaPonente,
        biografiaPonente,
        fotoPonente,
        textoAlternativoFoto,
        categoria,
        capacidad,
        plazasDisponibles}) {

		this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.lugar = lugar;
        this.direccion = direccion;
        this.fechasDisponibles = [
            {
                fecha: fecha,
                horas: [hora],
                horaFin: horaFin
            }
        ];
        this.ponente = ponente;
        this.empresaPonente = empresaPonente;
        this.biografiaPonente = biografiaPonente;
        this.fotoPonente = fotoPonente;
        this.textoAlternativoFoto = textoAlternativoFoto;
        this.categoria = categoria;
        this.capacidad = capacidad;
        this.plazasDisponibles = plazasDisponibles;
	}

	static fromJSON(json) {

        const inicio = new Date(json.starts_at);
        const fin = new Date(json.ends_at);

		  return new Charla({
            id: json.id,
            titulo: json.title,
            descripcion: json.description,
            lugar: json.location.name,
            direccion: json.location.address,
            // Fecha (AAAA-MM-DD) en hora de Madrid, igual que la hora que se muestra
            fecha: inicio.toLocaleDateString("sv-SE", { timeZone: "Europe/Madrid" }),
            hora: inicio.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Madrid"
            }),
            horaFin: fin.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Madrid"
            }),
            ponente: json.speaker_name,
            empresaPonente: json.speaker_company,
            biografiaPonente: json.speaker_bio,
            fotoPonente: json.speaker_photo,
            textoAlternativoFoto: json.speaker_photo_alt,
            categoria: json.category.name,
            capacidad: json.capacity,
            plazasDisponibles: json.seats_available
        });
	}

	toJSON() {
		return {  
            id: this.id,
            title: this.titulo,
            description: this.descripcion,
            starts_at: `${this.fechasDisponibles[0].fecha}T${this.fechasDisponibles[0].horas[0]}:00`,
            speaker_name: this.ponente,
            speaker_company: this.empresaPonente,
            category: this.categoria,
            location: this.lugar,
            capacity: this.capacidad,
            seats_available: this.plazasDisponibles };
	}
}
