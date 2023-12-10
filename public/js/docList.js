const setupDocList = (docList, collectionName, searchFilters) => {
    const docList_filterForm = document.forms[collectionName + "List_filterForm"];
    const docList_head = document.getElementById(collectionName + "List_head");
    const docList_body = document.getElementById(collectionName + "List_body");
    const listOptions = {
        searchFilters,
        sortCriteria: {
            col: null,
            order: null
        }
    }
    if(docList_filterForm) {
        const filterInputs = Array.from(docList_filterForm.getElementsByTagName("input"));
        filterInputs.forEach(input => {
            input.addEventListener("input", () => {
                listOptions.searchFilters[input.name + "Filter"] = input.value;
                listDocs(docList_body, listOptions, collectionName);
            });
        })
    }
    const sortableHeaders = Array.from(docList_head.getElementsByClassName("docList_atomicHeader"));
    sortableHeaders.shift();
    sortableHeaders.forEach(th => {
        th.addEventListener("click", () => {
            listOptions.sortCriteria = handleSortDocList(docList_head, th, collectionName);
            listDocs(docList_body, listOptions, collectionName);
        });
    });
    listDocs(docList_body, listOptions, collectionName);
    if(sessionStorage.getItem("accountType") === "administrator") {
        addActionsColumn(docList_head, collectionName);
        addAddDocOption(docList, collectionName);
    }
}

const listDocs = async(tbody, options, collectionName) => {
    const docs = await fetchCollection(options.searchFilters, options.sortCriteria, collectionName);
    if(tbody.children.length > 0) {
        tbody.replaceChildren();
    }
    docs.forEach((doc, docNo) => {
        const docRow = document.createElement("tr");
        const relevantProperties = getRelevantDocProperties(doc, docNo, docRow, collectionName);
        docRow.setAttribute("id", collectionName + "Row_" + doc._id);
        docRow.classList.add(collectionName + "Row");
        populateDocListRow(docRow, doc, collectionName, relevantProperties);
        tbody.appendChild(docRow);

        if(sessionStorage.getItem("accountType") === "administrator") {
            if(collectionName === "movie") {
                if(docRow.classList.contains("movie_unavailable")) {
                    const rentField = Array.from(docRow.getElementsByClassName("movieRow_rent"))[0];
                    addRequestLink(rentField, {
                        key: "return",
                        value: "Zwróć",
                        linkTo: "/api/return/" + doc._id,
                        requestMethod: "POST",
                        fieldsToSend: [{
                            key: "movieID",
                            value: doc._id
                        }, {
                            key: "movieTitle",
                            value: doc.tytul
                        }]
                    });
                }
            }
            addActionsField(doc, docRow, collectionName);
        }
    });
}

const handleSortDocList = (headRow, targetHeader, collectionName) => {
    const docList_heading_sortSign = targetHeader.getElementsByClassName("table_heading_sortSign")[0];
    const sortOrderMap = {
        asc: {
            symbol: "\u2191", // &uarr;
            numericForm: 1
        },
        desc: {
            symbol: "\u2193", // &darr;
            numericForm: -1
        },
        getOrderBySymbol: (symbol) => {
            return sortOrderMap[Object.keys(sortOrderMap).find(order => (sortOrderMap[order].symbol === symbol))];
        },
        getOrderByNumericForm: (numericForm) => {
            return sortOrderMap[Object.keys(sortOrderMap).find(order => (sortOrderMap[order].numericForm === numericForm))];
        }
    }
    const sortOrderBefore = sortOrderMap.getOrderBySymbol(docList_heading_sortSign.textContent);
    let sortOrderAfter;
    if(docList_heading_sortSign.classList.contains("table_heading_sortSign_active")) {
        sortOrderAfter = sortOrderMap.getOrderByNumericForm(sortOrderBefore.numericForm * -1);
    }
    else {
        headRow.getElementsByClassName("table_heading_sortSign_active")[0].classList.remove("table_heading_sortSign_active");
        docList_heading_sortSign.classList.add("table_heading_sortSign_active");
        sortOrderAfter = sortOrderMap.asc;
    }
    docList_heading_sortSign.textContent = sortOrderAfter.symbol;
    const sortCriteria = {
        col: targetHeader.id.split(collectionName + "List_header_").pop(),
        order: sortOrderAfter.numericForm
    };
    return sortCriteria;
}

const fetchCollection = async(searchFilters, sortCriteria, collectionName) => {
    let endpoint = new URL("http://localhost:8000/api/" + collectionName + "s");
    if(searchFilters) {
        Object.keys(searchFilters).forEach(filterName => {
            if(searchFilters[filterName]) {
                endpoint.searchParams.append(filterName, searchFilters[filterName]);
            }
        });
    }
    if(sortCriteria && sortCriteria.col && sortCriteria.order) {
        endpoint.searchParams.append("sortBy", sortCriteria.col);
        endpoint.searchParams.append("sortOrder", sortCriteria.order);
    }
    return fetch(endpoint.href)
        .then((response) => {
            if(response.ok) {
                return response.json()
            }
        })
        .then((data) => data)
        .catch(console.error);
}

const getRelevantDocProperties = (doc, docNo, docRow, collectionName) => {
    const relevantProperties = [{
        key: "no",
        value: docNo + 1,
    }];
    if(collectionName === "movie") {
        relevantProperties.push({
            key: "title",
            value: doc.tytul,
            linkTo: "/movie/" + doc._id
        }, {
            key: "genre",
            value: doc.gatunek,
        }, {
            key: "director",
            value: doc.rezyser,
        }, {
            key: "duration",
            value: doc.czas_trwania_min,
        });
        if(doc.dostepny) {
            relevantProperties.push({
                key: "rent",
                value: "Wypożycz",
                linkTo: "/api/rent/" + doc._id,
                requestMethod: "POST",
                fieldsToSend: [{
                    key: "movieID",
                    value: doc._id
                }, {
                    key: "movieTitle",
                    value: doc.tytul
                }]
            });
        }
        else {
            relevantProperties.push({
                key: "rent",
                value: "Niedostępny"
            })
            docRow.classList.add("movie_unavailable");
        }
    }
    else if(collectionName === "rental") {
        relevantProperties.push({
            key: "client_firstName",
            value: doc.dane_klienta.imie
        }, {
            key: "client_lastName",
            value: doc.dane_klienta.nazwisko
        }, {
            key: "client_address",
            value: doc.dane_klienta.adres.ulica + " "
                + doc.dane_klienta.adres.nr_domu + "/"
                + doc.dane_klienta.adres.nr_lokalu + ", "
                + doc.dane_klienta.adres.kod_pocztowy + " "
                + doc.dane_klienta.adres.miejscowosc
        }, {
            key: "client_phone",
            value: doc.dane_klienta.telefon
        }, {
            key: "movie_id",
            value: doc.film._id
        }, {
            key: "movie_title",
            value: doc.film.tytul
        }, {
            key: "rentDate",
            value: new Date(doc.data_wypozyczenia).toLocaleString()
        }, {
            key: "plannedReturnDate",
            value: new Date(doc.data_planowanego_zwrotu).toLocaleString()
        }, {
            key: "actualReturnDate",
            value: doc.data_faktycznego_zwrotu ? new Date(doc.data_faktycznego_zwrotu).toLocaleString() : "Jeszcze nie zwrócono"
        });
    }
    else if(collectionName === "client") {
        relevantProperties.push({
            key: "accountType",
            value: doc.typ_konta
        }, {
            key: "userName",
            value: doc.nazwa_uzytkownika
        }, {
            key: "firstName",
            value: doc.imie
        }, {
            key: "lastName",
            value: doc.nazwisko
        }, {
            key: "password",
            value: doc.haslo
        }, {
            key: "street",
            value: doc.adres.ulica
        }, {
            key: "houseNo",
            value: doc.adres.nr_domu
        }, {
            key: "apartmentNo",
            value: doc.adres.nr_lokalu
        }, {
            key: "postalCode",
            value: doc.adres.kod_pocztowy
        }, {
            key: "city",
            value: doc.adres.miejscowosc
        }, {
            key: "phone",
            value: doc.telefon
        }, {
            key: "registeredDate",
            value: new Date(doc.data_rejestracji).toLocaleString()
        });
    }
    return relevantProperties;
}

const populateDocListRow = (docRow, doc, collectionName, relevantProperties) => {
    relevantProperties.forEach((property) => {
        const docField = document.createElement("td");
        displayDocPropertyInNode(docField, property, doc);
        docField.classList.add(collectionName + "Row_" + property.key);
        docRow.appendChild(docField);
    });
}

const displayDocPropertyInNode = (node, property) => {
    if(!property.linkTo) {
        node.textContent = property.value;
        return;
    }
    if(property.requestMethod) {
        addRequestLink(node, property);
        return;
    }
    const propertyLink = document.createElement("a");
    propertyLink.setAttribute("href", property.linkTo);
    propertyLink.textContent = property.value;
    node.appendChild(propertyLink);
}

const addRequestLink = (docField, property) => {
    const propertyForm = document.createElement("form");
    const requestBody = {};
    propertyForm.setAttribute("method", property.requestMethod);
    propertyForm.setAttribute("action", property.linkTo);

    property.fieldsToSend.forEach(field => {
        const propertyForm_valueToSend = document.createElement("input");
        propertyForm_valueToSend.setAttribute("type", "hidden");
        propertyForm_valueToSend.setAttribute("value", field.value);
        propertyForm.appendChild(propertyForm_valueToSend);
        requestBody[field.key] = field.value;
    });

    const propertyForm_submitLink = document.createElement("input");
    propertyForm_submitLink.setAttribute("type", "submit");
    propertyForm_submitLink.setAttribute("value", property.value);
    propertyForm_submitLink.classList.add("btnLink");

    propertyForm.appendChild(propertyForm_submitLink);
    propertyForm.addEventListener("submit", (event) => {
        if(property.onSubmit) {
            property.onSubmit(event, requestBody, property);
            return;
        }
        event.preventDefault();
        sendGenericRequest(requestBody, property.linkTo, property.requestMethod);
    });
    docField.appendChild(propertyForm);
}

const addAddDocOption = (docList, collectionName) => {
    const btnAddDoc = document.createElement("a");
    btnAddDoc.setAttribute("id", "btn_add_" + collectionName);
    btnAddDoc.setAttribute("href", "/add_" + collectionName);
    btnAddDoc.classList.add(...["btnLink", "btn_add_doc"]);
    btnAddDoc.textContent = "Dodaj";
    docList.insertAdjacentElement("afterend", btnAddDoc);
}

const addActionsColumn = (docList_head, collectionName) => {
    const docList_headRows = Array.from(docList_head.getElementsByTagName("tr"));
    const docList_header_action = document.createElement("th");
    const table_heading_sortSign = document.createElement("span");

    table_heading_sortSign.classList.add("table_heading_sortSign");
    table_heading_sortSign.textContent = "\u2191";

    docList_header_action.setAttribute("id", collectionName + "List_header_actions");
    docList_header_action.setAttribute("rowspan", docList_headRows.length);
    docList_header_action.classList.add(...["docList_atomicHeader", "docList_header_actions"]);
    docList_header_action.textContent = "Akcje";
    docList_header_action.appendChild(table_heading_sortSign);
    docList_headRows[0].appendChild(docList_header_action);
}

const addActionsField = (doc, docRow, collectionName) => {
    const docRow_actions = document.createElement("td");
    const btnModifyDoc = document.createElement("a");
    const br = document.createElement("br");

    btnModifyDoc.classList.add("btnLink");
    btnModifyDoc.setAttribute("href", "/modify_" + collectionName +  "/" + doc._id);
    btnModifyDoc.textContent = "Modyfikuj";

    docRow_actions.classList.add(collectionName + "Row_actions");
    docRow_actions.appendChild(btnModifyDoc);
    docRow_actions.appendChild(br);
    addRequestLink(docRow_actions, {
        key: "delete_" + collectionName,
        value: "Usuń",
        linkTo: "/api/delete_" + collectionName + "/" + doc._id,
        requestMethod: "DELETE",
        fieldsToSend: [{
            key: collectionName + "ID",
            value: doc._id
        }],
        onSubmit: (event, requestBody, property) => {
            event.preventDefault();
            const confirmDelete = confirm("Czy na pewno chcesz usunąć ten dokument? Tej operacji nie można cofnąć!");
            if(confirmDelete) {
                sendGenericRequest(requestBody, property.linkTo, property.requestMethod)
            }
        }
    })

    docRow.appendChild(docRow_actions);
}