import * as React from "react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Item } from "../models";
import { FcFilledFilter } from "react-icons/fc";
import { IoChevronDownOutline } from "react-icons/io5";
import { IoIosCloseCircle, IoMdArrowRoundDown } from "react-icons/io";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { CardComponent } from "../card/card";
import { IoSearch } from "react-icons/io5";
import "./filters.css";

interface FilterProps {
  list?: Item[];
}

export const FilterComponent: React.FC<FilterProps> = (
  props: React.PropsWithChildren<FilterProps>
) => {
  const { list = [] } = props;

  const noResults = "img/no-results.svg";
  const [searchName, setSearchName] = useState("");
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);

  const [toggle, setToggle] = useState(false);
  const [orderRecent, setOrderRecent] = useState(false);
  const [visibleItems, setVisibleItems] = useState(8);

  const [showList, setShowList] = useState(false);

  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputSearch = useRef<HTMLInputElement>(null);
  const buttonFilter = useRef<HTMLButtonElement>(null);
  const contentFilter = useRef<HTMLDivElement>(null);
  const [searchIcon, setSearchIcon] = useState(false);

  const [filteredDepartments, setFilteredDepartments] = useState(departments);

  useEffect(() => {
    fetch(
      "https://apis.datos.gob.ar/georef/api/departamentos?provincia=Buenos%20Aires&max=135"
    )
      .then((response) => response.json())
      .then((data) => {
        let departamentos = data.departamentos.map(
          (departamento: { nombre: string }) => departamento.nombre
        );
        departamentos = departamentos.sort();
        setDepartments(departamentos);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Aplicar el filtro cuando departments cambie
    setFilteredDepartments(departments);
  }, [departments]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
    setVisibleItems(8);
  };
  const handleDelete = () => {
    if (inputNameRef.current) {
      inputNameRef.current.value = "";
      setSearchName("");
      setVisibleItems(8);
    }
  };

  const handlePetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPet(event.target.value);
    setVisibleItems(8);
  };

  const toggleFilter = () => {
    if (window.innerWidth > 768) {
      setToggle(false);
    } else {
      setToggle(!toggle);
    }
  };

  const filteredItems = list
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchName.toLowerCase()) &&
        (selectedPet === "" || item.type === selectedPet) &&
        (selectedLocation === "" || item.district === selectedLocation)
    )
    .sort((a, b) => {
      const dateA = new Date(a.date?.split("-").reverse().join("-")).getTime();
      const dateB = new Date(b.date?.split("-").reverse().join("-")).getTime();
      return orderRecent ? dateA - dateB : dateB - dateA;
    });

  const handleLoadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 8);
  };

  const handleOrderRecent = () => {
    setOrderRecent(!orderRecent);
  };

  const FilterName = () => {
    return (
      <div className="w-full md:w-[12rem] relative">
        <p className="text-white">Nombre</p>
        <input
          type="text"
          onChange={handleSearch}
          value={searchName}
          ref={inputNameRef}
          className="rounded py-1 px-1 min-w-full w-full"
        />
        <button
          className={`absolute right-[4px] top-[30px] rounded-full ${
            inputNameRef.current?.value.length != 0 ? "block" : "hidden"
          }`}
          onClick={handleDelete}
        >
          <IoIosCloseCircle size={20} color="#B45309" />
        </button>
      </div>
    );
  };

  const FilterPet: React.FC = () => {
    return (
      <div className="w-full md:w-[12rem]">
        <p className="text-white">Mascota</p>
        <select
          onChange={handlePetChange}
          value={selectedPet}
          className="rounded py-1 min-w-full"
        >
          <option value="">Todos</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
        </select>
      </div>
    );
  };

  //Buscador de localidades
  //Input para buscar localidades
  const inputLocationFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setShowList(true);
  };

  const inputLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value == "" ? setSearchIcon(false) : setSearchIcon(true);
    let filtered = [];
    filtered = departments.filter((department) =>
      department.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredDepartments(filtered);
  };

  const inputLocationClear = () => {
    if (inputSearch.current) {
      inputSearch.current.value = "";
    }
    setFilteredDepartments(departments);
    setSelectedLocation("");
    setSearchIcon(false);
  };

  const selectLocationInput = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonLocation = event.currentTarget.textContent || "";
    setSelectedLocation(buttonLocation);
    setShowList(false);
    if (inputSearch.current) {
      inputSearch.current.value = buttonLocation;
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputSearch.current &&
      !inputSearch.current.contains(event.target as Node)
    ) {
      setShowList(false);
    }
    if (
      buttonFilter.current &&
      !buttonFilter.current.contains(event.target as Node) &&
      contentFilter.current &&
      !contentFilter.current.contains(event.target as Node)
    ) {
      setToggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  const FilterLocation = () => {
    return (
      <div className="w-full md:w-[12rem]">
        <p className="text-white">Partido</p>
        <div className="relative">
          <input
            type="search"
            onFocus={inputLocationFocus}
            onChange={inputLocationChange}
            className="w-full rounded py-1 px-1 min-w-full input-location-filter"
            ref={inputSearch}
          />
          <IoSearch
            size={18}
            className={`absolute top-2 right-2 text-slate-600 ${
              searchIcon ? "hidden" : "inline-block"
            }`}
          />
          <button
            type="reset"
            className={`absolute top-2 right-2 rounded-full block ${
              searchIcon ? "inline-block" : "hidden"
            }`}
            onClick={inputLocationClear}
          >
            <IoIosCloseCircle size={20} color="#B45309" />
          </button>
          <div
            className={`absolute top-[2.2rem] bg-slate-50 w-full z-10 ${
              showList ? "flex-col" : "hidden"
            }`}
          >
            {filteredDepartments.length == 0 ? (
              <button
                className="text-slate-500 px-4 cursor-pointer py-1 text-left w-full"
                disabled
              >
                No hay resultados 😓
              </button>
            ) : (
              filteredDepartments.map((department, index) => (
                <button
                  key={index}
                  className="hover:bg-slate-600 hover:text-white px-4 py-1 cursor-pointer text-left w-full border-gray-200 border-b-[1px]  focus:outline focus:outline-amber-600 focus:rounded focus:outline-2 "
                  onClick={selectLocationInput}
                >
                  {department}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const OrderDate: React.FC = () => {
    return (
      <div className="">
        <p className="text-white">
          <HiMiniArrowsUpDown
            className="text-amber-600 inline-block"
            size={20}
          />{" "}
          Ordenar por fecha:
        </p>
        <button
          className="bg-slate-50 px-2 py-1 rounded md:mx-auto mt-1 md:mt-0 block min-w-[130px]"
          onClick={handleOrderRecent}
        >
          {orderRecent ? "Más recientes" : "Más antiguos"}
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="relative md:flex md:justify-center md:bg-slate-800 md:max-w-fit md:mx-auto md:rounded md:pl-3 md:my-4 ">
        <div>
          <button
            className={`p-2 px-4 mb-3 md:mb-0 min-w-[15rem] md:min-w-fit flex items-center justify-between md:justify-center md:my-5 ml-3 md:ml-0 rounded-full md:rounded md:bg-transparent md:px-2 ${
              toggle ? "bg-white text-slate-800" : "bg-slate-800 text-white"
            }`}
            ref={buttonFilter}
            onClick={toggleFilter}
          >
            <span className="flex items-center gap-2">
              <FcFilledFilter className="inline-block" />
              <span className="hidden md:inline">Filtrar por:</span>
              <span className="md:hidden">Filtrar | Ordenar</span>
            </span>
            <IoChevronDownOutline
              className={`text-amber-600 transition-all md:hidden ${
                toggle ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>
        <div
          className={`flex flex-col items-start justify-center flex-wrap gap-4 rounded-xl p-3 ${
            toggle
              ? "absolute top-[42px] left-3 w-[15rem] bg-slate-800/70 z-10 backdrop-blur"
              : "hidden md:flex md:flex-row md:static md:w-fit bg-transparent"
          }`}
          ref={contentFilter}
        >
          {FilterName()}
          <FilterPet />
          {FilterLocation()}
          <OrderDate />
        </div>
      </div>

      <div className="flex flex-row justify-center flex-wrap gap-4 md:gap-8 p-1 md:mx-auto">
        {filteredItems.length === 0 ? (
          <div className="min-h-[500px] flex flex-col items-center md:justify-center text-slate-50 cabin">
            <p className="text-xl mb-4">No hay resultados para tu búsqueda</p>
            <Image
              src={noResults}
              alt="Sin resultados"
              width={320}
              height={320}
            ></Image>
          </div>
        ) : (
          filteredItems
            .slice(0, visibleItems)
            .map((item, index) => (
              <CardComponent
                key={index}
                title={item.name}
                imageSrc={item.image}
                district={item.district}
                location={item.location}
                description={item.description}
                age={item.age}
                date={item.date}
              />
            ))
        )}
        {filteredItems.length > visibleItems && (
          <div className="w-full">
            <button
              onClick={handleLoadMore}
              className="flex items-center justify-center gap-2 min-w-[200px] mx-auto mt-4 px-4 py-2 shadow text-lg text-white bg-slate-800 rounded-full"
            >
              Ver más
              <IoMdArrowRoundDown size={24} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
