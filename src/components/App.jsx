import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Searchbar } from './Searchbar/Searchbar';
import { getImages, PER_PAGE } from '../api/Api';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { LoadMoreBtn } from './Button/Button';
import css from '../styles/Styles.module.css';

export function App() {
  const [images, setImages] = useState([]);
  const [searchQuery, setsearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [tags, setTags] = useState('');
  const [currentImgPerPage, setCurrentImgPerPage] = useState(null);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    async function fetchImages() {
      try {
        setIsLoading(true);

        const images = await getImages(searchQuery, currentPage);

        if (images.length === 0) {
          setCurrentImgPerPage(null);
          toast.error(`Images ${searchQuery} not found`);
          return;
        }

        setImages(prevImages => [...prevImages, ...images]);
        setCurrentImgPerPage(images.length);
      } catch {
        toast.error('Failed to load images :(');
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, [searchQuery, currentPage]);

  const searchImages = searchText => {
    if (searchQuery === searchText) {
      return;
    }

    setImages([]);
    setCurrentPage(1);
    setsearchQuery(searchText);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const openModal = (largeImageURL, tags) => {
    setLargeImageURL(largeImageURL);
    setTags(tags);

    toggleModal();
  };

  const loadMoreBtn = () => {
    setCurrentPage(сurrentPage => сurrentPage + 1);
  };

  return (
    <div className={css.app}>
      <Searchbar onSubmit={searchImages} isSubmitting={isLoading} />

      {images.length > 0 && (
        <>
          <ImageGallery images={images} onClickImg={openModal} />
          {currentImgPerPage < PER_PAGE && (
            <h2 className={css.no__more}>No more pictures :(</h2>
          )}
        </>
      )}

      {showModal && (
        <Modal
          largeImageURL={largeImageURL}
          tags={tags}
          onClose={toggleModal}
        />
      )}

      <Loader isLoading={isLoading} />

      {currentImgPerPage === PER_PAGE && (
        <LoadMoreBtn onLoadMore={loadMoreBtn} />
      )}

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#ff0000',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
