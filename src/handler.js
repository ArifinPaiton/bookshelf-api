const { nanoid } = require('nanoid');
const books = require('./books');

// handler tambah buku
const handlerTambahBuku = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const bukuBaru = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  if (!bukuBaru.name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (bukuBaru.readPage > bukuBaru.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(bukuBaru);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// handler untuk menampilkan semua buku
const handlerTampilSemuaBuku = (request, h) => {
  const { name, reading, finished } = request.query;
  let buku = books;

  if (buku.length > 0) {
    // untuk menampilkan data buku sesuai nama
    if (name !== undefined) {
      buku = buku.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
    }
    // untuk menampilkan buku yg sedang reading
    if (reading == 1 ){
      buku = buku.filter((b) => b.reading === true);
    }
    // untuk menampilkan buku yg tidak reading
    if (reading == 0) {
      buku = buku.filter((b) => b.reading === false);
    }
    // untuk menampilkan buku yg sudah finished
    if (finished == 1) {
      buku = buku.filter((b) => b.finished === true);
    }
    // untuk menampilkan buku yg belum finished
    if (finished == 0) {
      buku = buku.filter((b) => b.finished === false);
    }

    const response = h.response({
      status: 'success',
      data: {
        // kode untuk mengambil sebagian data
        books: buku.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

// handler untuk menampilkan buku sesuai id
const handlerTampilBukuSesuaiId = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((n) => n.id === bookId)[0];
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// handler untuk mengubah data buku
const handlerUbahBuku = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        books: books.map((book) => ({
          name: book.name,
        })),
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// handler untuk menghapus data buku
const handlerHapusBuku = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  handlerTambahBuku, handlerTampilSemuaBuku, handlerTampilBukuSesuaiId, handlerUbahBuku, handlerHapusBuku,
};
