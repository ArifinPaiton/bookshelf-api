const { handlerTambahBuku, handlerTampilSemuaBuku, handlerTampilBukuSesuaiId, handlerUbahBuku } = require('./handler');

const routes = [
  // untuk menambah buku
  {
    method: 'POST',
    path: '/books',
    handler: handlerTambahBuku,
  },
  // untuk menampilkan semua buku
  {
    method: 'GET',
    path: '/books',
    handler: handlerTampilSemuaBuku,
  },
  // untuk menampilkan detail buku sesuai id
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: handlerTampilBukuSesuaiId,
  },
  // untuk mengubah data buku
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: handlerUbahBuku,
  },
];

module.exports = routes;
