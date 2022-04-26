import React, { useMemo } from 'react';
import styles from './styles.module.scss';

interface PagintaionDTO{
  limit: number;
  total: number;
  offset: number;
  setOffset: (newOffset: number) => void
}

const MAX_ITEMS = 5;
const MAX_LEFT = (MAX_ITEMS - 1) / 2 ;

export function Pagination({ limit, total, offset, setOffset }: PagintaionDTO) {
  const current = useMemo(() => {
    return offset ? (offset / limit) + 1 : 1;
  }, [offset, limit]);

  const pages = useMemo(() => {
    return Math.ceil(total/limit)
  }, [total, limit])

  const first = useMemo(() => {
    return Math.max(current - MAX_LEFT, 1)
  }, [current])

  return (
    <ul className={styles.ul}>
      <li>
        <button className={styles.button}
          onClick={() => setOffset(0)}
          disabled={current === 1}
        >
          «
        </button>
      </li>
      <li>
        <button className={styles.button}
          onClick={() => setOffset((current - 2) * limit)}
          disabled={current === 1}
        >
          ‹
        </button>
      </li>
      {Array
        .from({length: MAX_ITEMS})
        .map((_, index) => index + first)
        .map(page => 
          <li key={page}>
            <button className={styles.button}
              disabled={current === page || page > pages}
              onClick={() => setOffset((page - 1) * limit)}
            >
              {page}
            </button>
          </li>
        )}
      <li>
        <button className={styles.button}
          onClick={() => setOffset((current) * limit)}
          disabled={current === pages}
        >
          ›
        </button>
      </li>
      <li>
        <button className={styles.button}
          onClick={() => setOffset((pages - 1) * limit)}
          disabled={current === pages}
        >
          »
        </button>
      </li>
    </ul>
  )
}